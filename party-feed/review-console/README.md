# party-feed review console

A small **local-only** web app for a human to review the scraper's queue,
fill in details a flyer image contains but the caption doesn't, and mark
posts for publishing.

## Stack

- **Backend:** `server.py` — Python standard library only (`http.server`).
  No `pip install` needed, no external dependencies. It:
  - serves the static UI in `static/`
  - exposes `GET /api/queues`, `GET /api/queue?file=...`, `POST /api/publish`
  - never makes any outbound network calls itself
  - never writes anywhere except `party-feed/published/published.json`
- **Frontend:** plain HTML/CSS/JS in `static/` — no framework, no build step,
  no npm dependencies. The only outbound requests the page makes are to load
  flyer images from their `image_url` and to talk to the local server above.

## Run it

```
cd party-feed/review-console
python server.py
```

Then open http://127.0.0.1:8765/ in a browser.

## How it works

1. On load, the page lists queue files from `party-feed/review_queue/`
   (`GET /api/queues`) and loads the newest one automatically. Use the
   dropdown to pick an older file instead.
2. Items render as cards, `likely_party` items sorted first. Each card shows
   the flyer image, caption, a link to the original post, and likes/comments.
3. Editable fields per item:
   - `event_time` — free text.
   - If the account's `address_mode` is `"public"`: an editable `address`
     field, pre-filled from the queue.
   - If `address_mode` is `"dm"`: **there is no address input in the DOM at
     all** — the public-address block is removed from the page, not just
     hidden with CSS. Instead you see a read-only `Address: DM @handle` note
     and an `area` field for a coarse location only (e.g. "Euclid Ave").
   - A `publish` checkbox.
4. **Save** posts the full (edited) item list to `POST /api/publish`. The
   server keeps only items with `review.publish === true` and writes them to
   `party-feed/published/published.json`. As a second safety net, the server
   also strips any `address` field from `dm`-mode items before writing, even
   though the UI never lets one be entered in the first place.

## Data contract

The console reads/writes exactly the item shape documented in
`party-feed/README.md` — it does not add, rename, or reinterpret fields
beyond what's described there.
