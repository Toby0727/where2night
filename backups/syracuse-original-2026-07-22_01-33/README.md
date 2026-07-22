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

No build step. Just open the file:

```bash
open index.html        # macOS
# or double-click index.html, or drag it into a browser
```

Everything runs client-side. Leaflet is vendored locally in `vendor/leaflet/`,
so the app works without a CDN. The only thing that needs internet is the map
**tiles** — if you're offline, the map goes dark but the list still works.

## What's in the prototype

- **Split view** — interactive map on the left, synced list on the right.
  Click a pin → the card highlights and a detail sheet opens, and vice-versa.
- **Status as color** — the whole palette encodes the core question. Open
  tonight = warm amber glow, opens later = yellow, dark tonight = cold/dim.
  On the map, open houses literally light up.
- **Filters** — All / Open now / No cover / Frats / Bars & venues / Live music.
- **Detail sheet** — doors, cover, how packed it is, the "word tonight," and an
  **"Update tonight's status"** button with a "last updated X min ago" line.
- **Responsive** — on phones the map goes full-screen with the list as a
  pull-up sheet.

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

Plain HTML/CSS/JS + [Leaflet](https://leafletjs.com/) (vendored). Map tiles from
CARTO. No framework, no backend — everything's in one file so it's easy to hack on.
