-- social_accounts: links WeChat/Douyin identities to a user.
--
-- Google (and any other native Supabase Auth provider) is already tracked in
-- auth.identities the moment a user signs in with it — no extra table needed
-- for Google. WeChat and Douyin are NOT supported natively by Supabase Auth,
-- so the wechat-oauth / douyin-oauth edge functions do the code exchange
-- themselves and record the identity here.

create type public.social_provider as enum ('wechat', 'douyin');

create table public.social_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  provider public.social_provider not null,
  provider_user_id varchar not null,
  provider_email varchar,
  created_at timestamptz not null default now(),
  unique (provider, provider_user_id)
);

comment on table public.social_accounts is
  'One row per linked WeChat/Douyin identity. provider_user_id is unionid/openid for wechat, open_id for douyin.';

alter table public.social_accounts enable row level security;

create policy "social_accounts are viewable by owner"
  on public.social_accounts for select
  using (auth.uid() = user_id);

-- Inserts/deletes happen only from the edge functions using the service-role
-- key, which bypasses RLS by design — no policy needed for those.
