# party-feed

A self-contained subsystem for building a semi-automatic feed of Syracuse
events/parties sourced from public Instagram accounts. Nothing here touches
or depends on the rest of the repo — this whole folder can be deleted with
`rm -rf party-feed/` with zero impact elsewhere.

## Why human-in-the-loop

Flyer text (date, time, cover charge, address) usually lives **inside the
image**, not in the caption. This subsystem does not OCR flyers. Instead:

1. A **scraper** pulls public post metadata (caption, image URL, likes,
   etc.) and queues NEW posts for review.
2. A **review console** lets a human open each queued post, look at the
   flyer image, and fill in the details by hand before marking it publish-ready.

## Hard rules baked into this subsystem

1. **Public data only.** The scraper reads public posts logged out — no
   login, no credentials, no session cookies by default.
2. **No DMs, ever.** Nothing here sends, reads, or automates Instagram
   Direct in any way.
3. **Address policy is per-account**, set in `scraper/party_feed_scraper.py`'s
   `HANDLES` config:
   - `"public"` accounts (venues/promoters who post their address on
     purpose): address may be auto-detected from the caption and shown.
   - `"dm"` accounts (house parties that gate the address behind "DM for
     address"): the address is **never** extracted, stored, or displayed —
     even if one happens to appear in the caption text. The review console
     makes it structurally impossible to enter a full address for these
     items, and the publish step strips `address` from any `dm` item again
     as a second safety net.
4. **Rate limits respected.** Small handle list, randomized delay between
   accounts (8–20s), capped posts per account (12), 10-day lookback.
5. **Resilient.** One failing, blocked, or private account is logged and
   skipped — it never crashes the run.

## Flow

```
scraper/party_feed_scraper.py
        │  (instaloader, public metadata only)
        ▼
review_queue/queue_<timestamp>.json   ← NEW posts only, seen ones skipped
        │
        ▼
review-console/  (open in a browser, human reviews each item)
        │  Save
        ▼
published/published.json              ← only publish:true items; the
                                          site can consume this later
```

## Running the scraper

```
cd party-feed
pip install -r requirements.txt
python scraper/party_feed_scraper.py
```

Edit `HANDLES` at the top of `scraper/party_feed_scraper.py` to add/remove
accounts — keep the list small and mark each one `"public"` or `"dm"`
correctly; that flag is what drives the address policy in HARD RULE 3 above.

Each run:
- reads `scraper/seen_shortcodes.json` to skip posts already queued in a
  previous run, and updates it with everything seen this run
- writes `review_queue/queue_<UTC timestamp>.json` if there's anything new
  (no file is written on a run with zero new posts)
- flags posts as `likely_party` using a tunable keyword list — this only
  affects review order, it never filters posts out

A sample queue file, `review_queue/queue_20260720T030000Z.json`, is included
so the review console has something to render out of the box without running
the scraper first.

## Running the review console

```
cd party-feed/review-console
python server.py
```

Then open http://127.0.0.1:8765/. See `review-console/README.md` for
details on the (dependency-free) stack and how Save works.

## Data contract

Every item in a `review_queue/queue_*.json` file, and every item the review
console loads/saves, has this shape:

```json
{
  "handle": "funknwaffles",
  "shortcode": "ABC123",
  "permalink": "https://www.instagram.com/p/ABC123/",
  "posted_at_utc": "2026-07-25T03:00:00+00:00",
  "caption": "…",
  "image_url": "https://…/flyer.jpg",
  "is_video": false,
  "likes": 210,
  "comments": 14,
  "likely_party": true,
  "review": {
    "event_time": null,
    "address_mode": "public",
    "address": "313 S Clinton St",
    "area": null,
    "publish": false
  }
}
```

`published/published.json` contains the same item shape, filtered to
`review.publish === true`, with `review.address` always omitted for `dm`
items.

## Non-goals

- No DM sending/reading, no login/credentialed scraping, no proxy/anti-bot
  evasion.
- No OCR of flyer images — a human reads them.
- No public deployment, no auth system, no database. Flat JSON files are the
  MVP storage, on purpose.
- No changes to the main site or any other code in this repo. This
  subsystem only *produces* `published/published.json` for the site to
  consume later; wiring that up is out of scope here.
