// Shared "log in as this social identity" step for providers Supabase Auth
// doesn't support natively (WeChat, Douyin).
//
// Supabase has no admin API to mint a session for an arbitrary user_id
// directly, so this uses the standard workaround: generate a magic-link OTP
// server-side with the service-role key, then immediately redeem it with
// verifyOtp using the anon key to get a real access/refresh token pair —
// the user never sees an email, this all happens inside the callback.
//
// WeChat/Douyin don't return a usable email for most apps, so unlike the
// SPEC's Google flow, step 2 ("matching email links to existing user") is
// skipped here — a linked social_accounts row is the only way to match an
// existing user for these two providers.
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

export type SocialProvider = "wechat" | "douyin";

export async function upsertSocialUserAndCreateSession(
  provider: SocialProvider,
  providerUserId: string,
) {
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: existing, error: lookupError } = await admin
    .from("social_accounts")
    .select("user_id")
    .eq("provider", provider)
    .eq("provider_user_id", providerUserId)
    .maybeSingle();
  if (lookupError) throw lookupError;

  let userId: string;
  let email: string;

  if (existing) {
    userId = existing.user_id;
    const { data: userRes, error: getUserError } = await admin.auth.admin.getUserById(userId);
    if (getUserError || !userRes.user?.email) throw getUserError ?? new Error("linked user has no email");
    email = userRes.user.email;
  } else {
    // RFC 2606 reserves .invalid for domains that are guaranteed non-resolvable —
    // this is a placeholder identity, not a real deliverable address.
    email = `${provider}_${providerUserId}@${provider}.invalid`;
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { [`${provider}_id`]: providerUserId },
    });
    if (createError) throw createError;
    userId = created.user.id;

    const { error: insertError } = await admin.from("social_accounts").insert({
      user_id: userId,
      provider,
      provider_user_id: providerUserId,
    });
    if (insertError) throw insertError;
  }

  const { data: link, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (linkError) throw linkError;

  const anon = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: verified, error: verifyError } = await anon.auth.verifyOtp({
    email,
    token: link.properties.email_otp,
    type: "magiclink",
  });
  if (verifyError) throw verifyError;

  return {
    access_token: verified.session?.access_token,
    refresh_token: verified.session?.refresh_token,
    user: verified.user,
  };
}
