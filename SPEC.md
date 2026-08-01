# Reusable User-Account Backend — Build Spec

## Goal
Build a **reusable authentication backend** I can drop into multiple apps.
Each app runs its **own isolated PostgreSQL database** (switch via `DATABASE_URL`).
The code, schema, and API are identical across apps — only the env vars change.

Support **both** classic auth and social login:
- Email + password
- Username + password
- Google OAuth login
- WeChat (微信) OAuth login
- Douyin (抖音) OAuth login

## Tech Stack
- Python 3.11+
- FastAPI (expose OpenAPI docs at `/docs`)
- PostgreSQL + SQLAlchemy 2.x + Alembic (migrations)
- `passlib[bcrypt]` for password hashing
- `python-jose[cryptography]` for JWT
- `httpx` for calling OAuth provider APIs
- `pydantic-settings` for env config
- `python-dotenv`

## Project Structure
```
app/
  main.py            # FastAPI app + router registration
  config.py          # env-based settings (pydantic-settings)
  database.py        # engine, session, Base
  models/user.py     # User + linked social accounts
  schemas/           # Pydantic request/response models
  core/
    security.py      # bcrypt hashing, JWT create/verify
    deps.py          # get_current_user dependency
  routers/
    auth.py          # register / login / me
    oauth_google.py
    oauth_wechat.py
    oauth_douyin.py
  services/
    oauth_base.py    # shared OAuth flow helpers
alembic/             # migrations
.env.example
README.md
requirements.txt
```

## Database Schema

### Table: `users`
| column | type | notes |
|---|---|---|
| id | UUID | primary key, default uuid4 |
| email | varchar unique nullable | nullable because social-only users may lack it |
| username | varchar unique nullable | |
| password_hash | varchar nullable | null for social-only accounts |
| is_email_verified | boolean | default false |
| email_verify_token | varchar nullable | reserved |
| reset_password_token | varchar nullable | reserved |
| reset_token_expires | timestamptz nullable | reserved |
| status | enum(active, disabled) | default active |
| created_at | timestamptz | default now |
| updated_at | timestamptz | auto-update |

### Table: `social_accounts`
Links a provider identity to a user. One user can link multiple providers.
| column | type | notes |
|---|---|---|
| id | UUID | primary key |
| user_id | UUID FK -> users.id | cascade delete |
| provider | enum(google, wechat, douyin) | |
| provider_user_id | varchar | the openid/sub from the provider |
| provider_email | varchar nullable | if provider returns one |
| access_token | varchar nullable | optional, encrypt if stored |
| created_at | timestamptz | |
| **unique constraint** | (provider, provider_user_id) | one identity = one row |

## API Endpoints

### Classic auth
- `POST /auth/register` — body: email, username, password → creates user (bcrypt hash), returns JWT
- `POST /auth/login` — body: identifier (email OR username) + password → returns JWT
- `GET  /auth/me` — requires Bearer token → returns current user + linked providers

### Reserved (stub now, implement later)
- `POST /auth/verify-email`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

### Social login (OAuth2 authorization-code flow)
For **each** provider implement two endpoints:
- `GET  /auth/{provider}/login` — returns the provider's authorization URL (with state param)
- `GET  /auth/{provider}/callback` — receives `code`, exchanges it for provider token,
  fetches the provider user id, then:
  1. If a `social_accounts` row exists for (provider, provider_user_id) → log that user in.
  2. Else if a matching email exists on a user → link the social account to it.
  3. Else create a new user + social_accounts row.
  Return our own JWT in all cases.

Where `{provider}` ∈ `google`, `wechat`, `douyin`.

#### Provider-specific notes (put in code comments)
- **Google**: standard OAuth2/OIDC. Auth URL `https://accounts.google.com/o/oauth2/v2/auth`,
  token URL `https://oauth2.googleapis.com/token`, userinfo from the ID token (`sub`, `email`).
- **WeChat (微信)**: uses `appid`/`secret`, scope `snsapi_login` for website QR login.
  Auth URL `https://open.weixin.qq.com/connect/qrconnect`,
  token URL `https://api.weixin.qq.com/sns/oauth2/access_token` (returns `openid` + `unionid`).
  Use `unionid` as the stable id if available, else `openid`.
- **Douyin (抖音)**: auth URL `https://open.douyin.com/platform/oauth/connect/`,
  token exchange at `https://open.douyin.com/oauth/access_token/`, user id is `open_id`.

Keep each provider's client_id/secret/redirect_uri in env vars. If a provider's
env vars are missing, that provider's endpoints should return HTTP 501 "not configured"
rather than crashing — so I can ship with only Google enabled.

## Security Requirements (non-negotiable)
- Never store plaintext passwords — bcrypt via passlib only.
- All secrets (JWT `SECRET_KEY`, DB URL, every provider's client id/secret) come from env vars.
- JWT: HS256, include `sub` (user id) and `exp`; make expiry configurable (default 7 days).
- Validate the OAuth `state` param on callback to prevent CSRF.
- Enforce unique constraints on email, username, and (provider, provider_user_id).
- Return generic errors on login failure (don't reveal whether email vs password was wrong).

## .env.example (generate this file)
```
DATABASE_URL=postgresql+psycopg://user:pass@localhost:5432/app_one
SECRET_KEY=change-me
JWT_EXPIRE_DAYS=7

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

WECHAT_APP_ID=
WECHAT_APP_SECRET=
WECHAT_REDIRECT_URI=http://localhost:8000/auth/wechat/callback

DOUYIN_CLIENT_KEY=
DOUYIN_CLIENT_SECRET=
DOUYIN_REDIRECT_URI=http://localhost:8000/auth/douyin/callback
```

## README must include
- How to install deps and run (`uvicorn app.main:app --reload`)
- How to spin up a NEW app instance: create a new empty Postgres DB, copy `.env`,
  change `DATABASE_URL`, run `alembic upgrade head`, start the server.
- Which env vars each provider needs, and that providers with empty vars are auto-disabled (501).

## Deliverables
1. Full working code for classic auth + Google OAuth (end-to-end).
2. WeChat + Douyin routers fully coded but gated behind env presence (501 if unconfigured).
3. Alembic migration for both tables.
4. `.env.example`, `requirements.txt`, `README.md`.
5. A short `curl` example in the README for register → login → /auth/me.
