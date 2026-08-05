# Where2Night project guide

- The active prototype is root `index.html` plus its local `tokens.css`; it is a plain HTML/CSS/JS app with no frontend build step.
- Treat `index.html` and `tokens.css` as one publish unit; never commit or deploy the HTML reference without the stylesheet.
- Run it from the repository root with `python3 -m http.server 4173`, then open `http://127.0.0.1:4173/`.
- Desktop uses a map-left/feed-right layout. Mobile uses a visible bottom card rail; a map selection promotes the matching card, while tapping the card opens details.
- Keep the current midnight-blue, atmospheric-utilitarian palette with restrained ice/lilac/pink and cyan signals; preserve desktop/mobile interaction differences unless the user requests a structural redesign.
- `SPOTS` in `index.html` is illustrative prototype data. Do not present its statuses, prices, addresses, or access rules as verified current nightlife information.
- MapLibre, CARTO tiles, and the Supabase browser client load from the network. Typography comes from the local/system stack in `tokens.css`; the venue list is the offline fallback when map tiles fail.
- Supabase setup and migrations are documented in `docs/AUTH_SETUP.md`. Never expose a service-role key in browser code or commit `.env*` / `secret.toml` files.
- `docs/mvp-prd.md` and `docs/venue-research-v0.md` describe an archived China nightlife concept, not the active Syracuse interface.
- `night-map.html` is a standalone alternate experiment, and `party-feed/` is not wired into the active page; do not treat either as the root app.
- Before handoff, run the inline-script syntax check, `git diff --check`, and browser checks at 375px portrait plus phone landscape and desktop. Confirm no page-level horizontal overflow and test map-to-card-to-detail interaction.
