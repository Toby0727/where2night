# Where2Night project guide

- The active prototype is the root `index.html`; it is a plain HTML/CSS/JS app with no frontend build step.
- Run it from the repository root with `python3 -m http.server 4173`, then open `http://127.0.0.1:4173/`.
- Desktop uses a map-left/feed-right layout. Mobile uses a visible bottom card rail; a map selection promotes the matching card, while tapping the card opens details.
- Keep the current deep-blue Vaporwave palette and preserve desktop/mobile interaction differences unless the user requests a structural redesign.
- `SPOTS` in `index.html` is illustrative prototype data. Do not present its statuses, prices, addresses, or access rules as verified current nightlife information.
- MapLibre, CARTO tiles, Google Fonts, and the Supabase browser client load from the network. The venue list is the offline fallback when map tiles fail.
- Supabase setup and migrations are documented in `docs/AUTH_SETUP.md`. Never expose a service-role key in browser code or commit `.env*` / `secret.toml` files.
- `docs/mvp-prd.md` and `docs/venue-research-v0.md` describe an archived China nightlife concept, not the active Syracuse interface.
- Before handoff, run the inline-script syntax check, `git diff --check`, and browser checks at 375px portrait plus phone landscape and desktop. Confirm no page-level horizontal overflow and test map-to-card-to-detail interaction.
