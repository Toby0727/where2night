// WeChat (微信) OAuth2 login, via Supabase Edge Function since Supabase Auth
// has no native WeChat provider.
//
//   GET .../wechat-oauth/login              -> { url } authorization URL to redirect the user to
//   GET .../wechat-oauth/callback?code&state -> { access_token, refresh_token, user } Supabase session
//
// Deploy with: supabase functions deploy wechat-oauth
// Required secrets: WECHAT_APP_ID, WECHAT_APP_SECRET, WECHAT_REDIRECT_URI, OAUTH_STATE_SECRET
// If any of the three WeChat vars are missing, this returns 501 so the rest
// of the app can ship with only Google enabled (per SPEC.md).
import { createState, verifyState } from "../_shared/state.ts";
import { upsertSocialUserAndCreateSession } from "../_shared/social-session.ts";

const WECHAT_APP_ID = Deno.env.get("WECHAT_APP_ID");
const WECHAT_APP_SECRET = Deno.env.get("WECHAT_APP_SECRET");
const WECHAT_REDIRECT_URI = Deno.env.get("WECHAT_REDIRECT_URI");
const STATE_SECRET = Deno.env.get("OAUTH_STATE_SECRET") ?? "";

Deno.serve(async (req) => {
  if (!WECHAT_APP_ID || !WECHAT_APP_SECRET || !WECHAT_REDIRECT_URI) {
    return Response.json({ error: "wechat not configured" }, { status: 501 });
  }

  const url = new URL(req.url);

  if (url.pathname.endsWith("/login")) {
    const state = await createState(STATE_SECRET);
    const authUrl = new URL("https://open.weixin.qq.com/connect/qrconnect");
    authUrl.searchParams.set("appid", WECHAT_APP_ID);
    authUrl.searchParams.set("redirect_uri", WECHAT_REDIRECT_URI);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "snsapi_login");
    authUrl.searchParams.set("state", state);
    // WeChat's web QR login requires this literal fragment on the URL.
    return Response.json({ url: `${authUrl.toString()}#wechat_redirect` });
  }

  if (url.pathname.endsWith("/callback")) {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    if (!code || !(await verifyState(STATE_SECRET, state))) {
      return Response.json({ error: "invalid or expired state" }, { status: 400 });
    }

    const tokenUrl = new URL("https://api.weixin.qq.com/sns/oauth2/access_token");
    tokenUrl.searchParams.set("appid", WECHAT_APP_ID);
    tokenUrl.searchParams.set("secret", WECHAT_APP_SECRET);
    tokenUrl.searchParams.set("code", code);
    tokenUrl.searchParams.set("grant_type", "authorization_code");

    const tokenRes = await fetch(tokenUrl).then((r) => r.json());
    if (tokenRes.errcode) {
      return Response.json({ error: "wechat token exchange failed", detail: tokenRes }, { status: 502 });
    }

    // unionid is the stable id across all apps under the same WeChat Open
    // Platform account; not every app has it, so fall back to openid.
    const providerUserId: string = tokenRes.unionid ?? tokenRes.openid;

    try {
      const session = await upsertSocialUserAndCreateSession("wechat", providerUserId);
      return Response.json(session);
    } catch (err) {
      return Response.json({ error: "login failed", detail: `${err}` }, { status: 500 });
    }
  }

  return new Response("not found", { status: 404 });
});
