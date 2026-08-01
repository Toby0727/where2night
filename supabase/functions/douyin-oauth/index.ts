// Douyin (抖音) OAuth2 login, via Supabase Edge Function since Supabase Auth
// has no native Douyin provider.
//
//   GET .../douyin-oauth/login              -> { url } authorization URL to redirect the user to
//   GET .../douyin-oauth/callback?code&state -> { access_token, refresh_token, user } Supabase session
//
// Deploy with: supabase functions deploy douyin-oauth
// Required secrets: DOUYIN_CLIENT_KEY, DOUYIN_CLIENT_SECRET, DOUYIN_REDIRECT_URI, OAUTH_STATE_SECRET
// If any of the three Douyin vars are missing, this returns 501 so the rest
// of the app can ship with only Google enabled (per SPEC.md).
import { createState, verifyState } from "../_shared/state.ts";
import { upsertSocialUserAndCreateSession } from "../_shared/social-session.ts";

const DOUYIN_CLIENT_KEY = Deno.env.get("DOUYIN_CLIENT_KEY");
const DOUYIN_CLIENT_SECRET = Deno.env.get("DOUYIN_CLIENT_SECRET");
const DOUYIN_REDIRECT_URI = Deno.env.get("DOUYIN_REDIRECT_URI");
const STATE_SECRET = Deno.env.get("OAUTH_STATE_SECRET") ?? "";

Deno.serve(async (req) => {
  if (!DOUYIN_CLIENT_KEY || !DOUYIN_CLIENT_SECRET || !DOUYIN_REDIRECT_URI) {
    return Response.json({ error: "douyin not configured" }, { status: 501 });
  }

  const url = new URL(req.url);

  if (url.pathname.endsWith("/login")) {
    const state = await createState(STATE_SECRET);
    const authUrl = new URL("https://open.douyin.com/platform/oauth/connect/");
    authUrl.searchParams.set("client_key", DOUYIN_CLIENT_KEY);
    authUrl.searchParams.set("redirect_uri", DOUYIN_REDIRECT_URI);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "user_info");
    authUrl.searchParams.set("state", state);
    return Response.json({ url: authUrl.toString() });
  }

  if (url.pathname.endsWith("/callback")) {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    if (!code || !(await verifyState(STATE_SECRET, state))) {
      return Response.json({ error: "invalid or expired state" }, { status: 400 });
    }

    const tokenUrl = new URL("https://open.douyin.com/oauth/access_token/");
    tokenUrl.searchParams.set("client_key", DOUYIN_CLIENT_KEY);
    tokenUrl.searchParams.set("client_secret", DOUYIN_CLIENT_SECRET);
    tokenUrl.searchParams.set("code", code);
    tokenUrl.searchParams.set("grant_type", "authorization_code");

    const tokenRes = await fetch(tokenUrl, { method: "POST" }).then((r) => r.json());
    const data = tokenRes.data;
    if (!data || data.error_code) {
      return Response.json({ error: "douyin token exchange failed", detail: tokenRes }, { status: 502 });
    }

    const providerUserId: string = data.open_id;

    try {
      const session = await upsertSocialUserAndCreateSession("douyin", providerUserId);
      return Response.json(session);
    } catch (err) {
      return Response.json({ error: "login failed", detail: `${err}` }, { status: 500 });
    }
  }

  return new Response("not found", { status: 404 });
});
