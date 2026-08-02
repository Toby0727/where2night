# Tonight · Syracuse

A concept prototype for a **"what's open tonight" map** for Syracuse nightlife —
starting with Greek row. Half map, half list (Yelp's skeleton) with a live
"is it open right now" layer on top (Snap Map's soul).

The core question the product answers is the one students currently text each
other all night: **which houses/bars are actually open tonight, where are they,
and what's the cover?**

> ⚠️ **This is an interface prototype, not a real product.** All venues, statuses,
> covers, and addresses in `index.html` are **placeholder / illustrative data**,
> not real listings. It exists to show the interface and the data shape.

## Run it

No build step. Serve the repository root with any static server:

```bash
python3 -m http.server 4173
# open http://127.0.0.1:4173/
```

The interface is plain client-side HTML/CSS/JS. It loads MapLibre GL JS, CARTO's
dark vector style, Google Fonts, and the Supabase browser client from CDNs, so
those features need internet access. The venue list remains usable if map tiles
are unavailable.

## What's in the prototype

- **Desktop split view** — interactive map on the left, synced “What’s
  happening” feed on the right. Clicking a highlighted building selects the
  matching card and opens its detail sheet.
- **Yelp-style mobile feed** — the map stays primary while a horizontal card
  rail is visible automatically at the bottom. Tapping a building promotes its
  matching card to the first position without opening a modal; tapping the card
  opens full details. The handle expands a vertical list, and phone landscape
  moves that list to the right side.
- **Axo-style map** — the camera is pitched and rotated into an axonometric-like
  campus view. Nearby OpenStreetMap buildings are extruded over CARTO's dark
  basemap; tonight's spots are highlighted as complete building volumes instead
  of isolated pins.
- **Status as color and text** — open now uses vaporwave pink, opens later uses
  cyan, and dark tonight uses slate; every color state also has a text label.
  On the map, the full footprint and volume of each open house lights up.
- **Deep-blue Vaporwave UI** — slate-blue surfaces, restrained pink/cyan neon,
  retro-grid texture, and high-contrast monospaced typography.
- **Filters** — All / Open now / No cover / Frats / Bars & venues / Live music.
- **Detail sheet** — doors, cover, how packed it is, the "word tonight," and an
  **"Update tonight's status"** flow with a "last updated X min ago" line.
- **Google account flow** — the account sheet uses Supabase Auth; provider and
  redirect setup is documented in [`docs/AUTH_SETUP.md`](docs/AUTH_SETUP.md).
- **Freshness at a glance** — each card labels its report Fresh / Recent / Stale,
  so an old status never looks as trustworthy as a new one.

## Data shape

Each spot is one object in the `SPOTS` array in `index.html`. The fields split
into two kinds, and this split is the whole point:

| Static (set once)            | Tonight (changes daily — the hard part)      |
| ---------------------------- | -------------------------------------------- |
| `name`, `greek`, `type`      | `status` (open / soon / closed)              |
| `lat`, `lng`                 | `cover`, `opensAt`, `theme`, `crowd`, `line` |
| `live` (has live music)      | `updated` (freshness stamp)                  |

The **"tonight" fields are the product's heart and its hardest problem.** A pin
being on the map is worthless if "open tonight? / cover?" is stale. Whoever/whatever
keeps those fields fresh (the house's social chair via a one-tap link, students
reporting from the ground, etc.) is the real design question to solve next.

## Roadmap (not built yet)

1. **Real Syracuse data** — replace placeholders with actual houses/venues.
2. **A low-friction update mechanism** for the "tonight" fields — this is the
   make-or-break piece.
3. **User reports / "I'm going"** to crowd-source freshness and unlock
   RSVP-only spots.
4. Expand to a second school once one campus is genuinely useful.

## Notes to keep in mind (not code — but don't skip)

- **Liability is real.** A product that points people (potentially including
  minors) to paid parties with alcohol carries genuine exposure in the US.
  Age-gating, `.edu`-verified access, disclaimers, and explicitly not promising
  anyone's safety should be designed in from day one. Talk to someone who knows
  the relevant law before launch. *(This is a reminder, not legal advice.)*
- **Freshness is the product.** One student who shows up to a house that's
  actually closed stops trusting the app forever. Stale data is the failure mode
  to design against hardest.

## Stack

The UI is plain HTML/CSS/JS in `index.html`, with
[MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) and CARTO's dark
vector basemap. Supabase provides Google authentication and the optional
profile/social-account backend described in [`docs/AUTH_SETUP.md`](docs/AUTH_SETUP.md).
There is no frontend build step.

The highlighted venue polygons are intentionally illustrative rectangles built
around the placeholder coordinates. They demonstrate whole-building selection,
but are not asserted to be real parcel or building boundaries. Replace them with
verified OpenStreetMap footprints when the demo gets real Syracuse venue data.

## Archived concept

The previous Chinese `今晚不开卡` PRD and website are preserved under
`backups/tonight-no-table-2026-07-22_01-25-30/`. The active root demo is now
the Syracuse map described above.
