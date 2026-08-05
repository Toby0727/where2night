# User auth & storage — Supabase setup

This implements [`SPEC.md`](../SPEC.md)'s user-account backend on top of
**Supabase Auth** instead of a hand-rolled FastAPI/JWT/bcrypt server. Supabase
already provides, for free, everything the spec's classic-auth section asks
for:

| SPEC.md asked for              | Supabase equivalent                                  |
|---------------------------------|-------------------------------------------------------|
| bcrypt password hashing          | built into `auth.users`, never touched by our code    |
| `POST /auth/register`            | `POST /auth/v1/signup`                                 |
| `POST /auth/login`               | `POST /auth/v1/token?grant_type=password`             |
| `GET /auth/me`                   | `GET /auth/v1/user`                                    |
| HS256 JWT, `sub` + `exp`         | issued automatically by Supabase Auth                  |
| email verify / forgot / reset    | built-in (`/auth/v1/recover`, etc.)                    |
| Google OAuth                     | native provider, toggle in dashboard, zero code        |
| unique email / username          | `auth.users.email` unique + our `profiles.username` unique |

What we still had to build (this repo):

- **`profiles` table** — app-specific fields Supabase doesn't track
  (`username`, `status`), auto-created for every new `auth.users` row via a
  trigger. See [`supabase/migrations/20260801000000_create_profiles.sql`](../supabase/migrations/20260801000000_create_profiles.sql).
- **`social_accounts` table** — WeChat and Douyin aren't supported natively by
  Supabase Auth (only Google/GitHub/etc.-style OAuth providers are), so we
  track those identities ourselves. Google, by contrast, needs no extra table:
  Supabase already records it in `auth.identities` the moment someone signs in
  with it. See [`.../20260801000001_create_social_accounts.sql`](../supabase/migrations/20260801000001_create_social_accounts.sql).
- **`wechat-oauth` / `douyin-oauth` edge functions** — do the authorization-code
  exchange by hand and mint a Supabase session, gated behind env vars (return
  HTTP 501 if unconfigured, matching SPEC.md's "ship with only Google enabled"
  requirement). See [`supabase/functions/`](../supabase/functions/).

## Current browser integration

The active static page loads `supabase-js` from a CDN and creates its client
from the `SUPABASE_URL` and public `SUPABASE_ANON_KEY` constants in
[`index.html`](../index.html). There is no build-time environment injection, so
pointing the page at another project currently means changing those two
constants. A Supabase anon key is designed to be public and is constrained by
RLS; a service-role key must never appear in browser code.

The account sheet currently exposes Google sign-in only. The WeChat and Douyin
edge functions are optional backend scaffolds and are not wired into the active
page's UI. `.env.example` documents CLI/edge-function configuration; copying it
does not configure the static browser client automatically.

## 1. Create the Supabase project

This repo already has `supabase/config.toml` (`project_id = "where2night"`).
To point it at a real project:

```bash
brew install supabase/tap/supabase   # if the CLI isn't installed yet
supabase login
supabase link --project-ref <your-project-ref>   # from the dashboard URL
```

## 2. Run the migrations

```bash
supabase db push
```

This creates `profiles`, `social_accounts`, their triggers, and RLS policies
in your project's Postgres database.

## 3. Enable Google login

Dashboard -> **Authentication -> Providers -> Google** -> paste your Google
OAuth client ID/secret -> Save. Add the local and deployed page URLs to the
Supabase Auth redirect allow-list. No custom OAuth handler code is needed;
`supabase-js`'s
`signInWithOAuth({ provider: 'google' })` (or a plain redirect to
`GET {SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=...`) handles
the rest.

## 4. Deploy WeChat/Douyin (optional)

Only needed if you actually have WeChat/Douyin app credentials — otherwise
leave the secrets unset and both endpoints auto-disable with 501.

```bash
supabase secrets set \
  OAUTH_STATE_SECRET=$(openssl rand -hex 32) \
  WECHAT_APP_ID=... WECHAT_APP_SECRET=... WECHAT_REDIRECT_URI=... \
  DOUYIN_CLIENT_KEY=... DOUYIN_CLIENT_SECRET=... DOUYIN_REDIRECT_URI=...

supabase functions deploy wechat-oauth
supabase functions deploy douyin-oauth
```

Each function exposes two routes:
- `GET .../wechat-oauth/login` → `{ "url": "<authorization url with signed state>" }` — redirect the user here.
- `GET .../wechat-oauth/callback?code=...&state=...` → `{ access_token, refresh_token, user }`, a real Supabase session, same shape as any other login.

Same pair for `douyin-oauth`. These edge functions are scaffolded to the
providers' documented OAuth2 flows but **untested against live WeChat/Douyin
credentials** — verify against a real app before shipping.

## 5. Spinning up a new app from this same schema

Per SPEC.md's "reusable across apps" goal:

1. Create a new, empty Supabase project.
2. Copy `supabase/migrations/` and `supabase/functions/` into the new app's repo.
3. `supabase link --project-ref <new-ref>` then `supabase db push`.
4. Repeat steps 3–4 above for that project's own OAuth credentials.
5. Update the public `SUPABASE_URL` / `SUPABASE_ANON_KEY` constants in
   `index.html`, and add the app URLs to the Auth redirect allow-list.

Nothing in the schema or functions is hardcoded to this project — only env
vars/secrets change between apps, same as the original spec intended.

## curl walkthrough: register → login → me

```bash
export SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
export SUPABASE_ANON_KEY=...

# Register (username goes into user_metadata; our trigger copies it into profiles.username)
curl -s "$SUPABASE_URL/auth/v1/signup" \
  -H "apikey: $SUPABASE_ANON_KEY" -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"correct horse battery staple","data":{"username":"testuser"}}'

# Login
curl -s "$SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $SUPABASE_ANON_KEY" -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"correct horse battery staple"}'
# -> { "access_token": "...", "refresh_token": "...", "user": {...} }

# Me
curl -s "$SUPABASE_URL/auth/v1/user" \
  -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer <access_token from login>"

# This app's own profile fields (username, status) via the REST API,
# scoped by RLS to the caller's own row:
curl -s "$SUPABASE_URL/rest/v1/profiles?select=*" \
  -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer <access_token>"
```

## What we deliberately didn't build

- Login-identifier-agnostic ("email OR username") login — Supabase's
  password grant takes email (or phone, if enabled). If username-login is a
  hard requirement later, add a Postgres function that looks up email by
  username and call it client-side before hitting `/token`, or front the
  Auth API with a thin edge function.
- Custom `email_verify_token` / `reset_password_token` columns — Supabase
  handles verification and password reset itself
  (`/auth/v1/recover`, `/auth/v1/verify`); SPEC.md's reserved columns for
  these are superseded, not reimplemented.
