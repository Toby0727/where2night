"""
party-feed scraper
===================

Pulls recent PUBLIC Instagram posts (metadata only, logged-out) from a small,
configured list of Syracuse-area handles and writes NEW posts to a JSON
review queue for a human to look at (party-feed/review-console).

HARD RULES baked into this file — do not "optimize" them away:
  1. Public data only. No login, no credentials, no session cookies by default.
  2. No DMs, ever. This script never touches Instagram Direct in any way.
  3. Address policy is per-account (see HANDLES below):
       - "public" accounts: address may be auto-detected from the caption.
       - "dm" accounts: address is ALWAYS null, even if the caption contains
         one. The site links out to the account instead.
  4. Respect rate limits: small handle list, randomized delay between
     accounts, capped posts per account. No parallelism, no aggressive
     polling.
  5. Resilient: a failing/blocked/private account is logged and skipped —
     it must never crash the whole run.

This script does NOT download media to disk and does NOT attempt OCR of
flyer images — a human reads the flyer in the review console.
"""

from __future__ import annotations

import json
import random
import re
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

import instaloader

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

# handle -> "public" | "dm"
#   public: venue/promoter posts its own address on purpose.
#   dm:     house party account that gates the address behind "DM for address".
HANDLES: dict[str, str] = {
    "funknwaffles": "public",
    "songanddancesyr": "public",
    "syracusehardcore": "public",
    "caged.syr": "dm",
    "dazed.syr": "dm",
}

LOOKBACK_DAYS = 10
MAX_POSTS_PER_ACCOUNT = 12
SLEEP_BETWEEN_ACCOUNTS = (8, 20)  # seconds, randomized (min, max)

SCRIPT_DIR = Path(__file__).resolve().parent
PARTY_FEED_DIR = SCRIPT_DIR.parent
SEEN_SHORTCODES_PATH = SCRIPT_DIR / "seen_shortcodes.json"
REVIEW_QUEUE_DIR = PARTY_FEED_DIR / "review_queue"

# Tunable keyword heuristic used only to prioritize review order, never to
# filter posts out.
PARTY_KEYWORDS = [
    "party", "parties", "rager", "kickback", "kick back", "turn up", "turnup",
    "hardcore", "show", "gig", "concert", "dj set", "dj", "open mic",
    "flyer", "doors at", "doors open", "cover charge", "$ cover", "rsvp",
    "bash", "function", "afters", "after party", "pregame",
    "pre-game", "college night", "block party", "houseparty", "house party",
]

# Very simple US street-address heuristic: number + street name + suffix.
ADDRESS_RE = re.compile(
    r"\b\d{1,5}\s+(?:[A-Z][a-zA-Z.]*\s){1,4}"
    r"(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard|Dr|Drive|Ln|Lane|"
    r"Ct|Court|Way|Pl|Place|Sq|Square)\.?\b",
    re.IGNORECASE,
)


# ---------------------------------------------------------------------------
# Seen-shortcode persistence
# ---------------------------------------------------------------------------

def load_seen_shortcodes() -> set[str]:
    if not SEEN_SHORTCODES_PATH.exists():
        return set()
    try:
        with SEEN_SHORTCODES_PATH.open("r", encoding="utf-8") as f:
            data = json.load(f)
        return set(data.get("shortcodes", []))
    except (json.JSONDecodeError, OSError) as exc:
        print(f"[warn] could not read {SEEN_SHORTCODES_PATH}: {exc}")
        return set()


def save_seen_shortcodes(shortcodes: set[str]) -> None:
    SEEN_SHORTCODES_PATH.parent.mkdir(parents=True, exist_ok=True)
    with SEEN_SHORTCODES_PATH.open("w", encoding="utf-8") as f:
        json.dump({"shortcodes": sorted(shortcodes)}, f, indent=2)


# ---------------------------------------------------------------------------
# Heuristics
# ---------------------------------------------------------------------------

def looks_like_party(caption: str) -> bool:
    if not caption:
        return False
    lowered = caption.lower()
    return any(keyword in lowered for keyword in PARTY_KEYWORDS)


def extract_address(caption: str) -> str | None:
    if not caption:
        return None
    match = ADDRESS_RE.search(caption)
    return match.group(0).strip() if match else None


def build_review_block(address_mode: str, caption: str) -> dict:
    """Per HARD RULE 3: dm accounts never get an address, even if one is
    present in the caption text."""
    address = extract_address(caption) if address_mode == "public" else None
    return {
        "event_time": None,
        "address_mode": address_mode,
        "address": address,
        "area": None,
        "publish": False,
    }


# ---------------------------------------------------------------------------
# Post -> queue item
# ---------------------------------------------------------------------------

def post_to_queue_item(handle: str, address_mode: str, post: "instaloader.Post") -> dict:
    caption = post.caption or ""
    return {
        "handle": handle,
        "shortcode": post.shortcode,
        "permalink": f"https://www.instagram.com/p/{post.shortcode}/",
        "posted_at_utc": post.date_utc.replace(tzinfo=timezone.utc).isoformat(),
        "caption": caption,
        "image_url": post.url,
        "is_video": post.is_video,
        "likes": post.likes,
        "comments": post.comments,
        "likely_party": looks_like_party(caption),
        "review": build_review_block(address_mode, caption),
    }


# ---------------------------------------------------------------------------
# Scrape one account
# ---------------------------------------------------------------------------

def scrape_account(
    loader: instaloader.Instaloader,
    handle: str,
    address_mode: str,
    seen_shortcodes: set[str],
    cutoff: datetime,
) -> list[dict]:
    new_items: list[dict] = []
    try:
        profile = instaloader.Profile.from_username(loader.context, handle)
    except Exception as exc:  # noqa: BLE001 - one bad account must not crash the run
        print(f"[warn] {handle}: could not load profile ({exc}); skipping")
        return new_items

    if profile.is_private:
        print(f"[warn] {handle}: account is private; skipping")
        return new_items

    try:
        posts_checked = 0
        for post in profile.get_posts():
            if posts_checked >= MAX_POSTS_PER_ACCOUNT:
                break
            posts_checked += 1

            post_date = post.date_utc.replace(tzinfo=timezone.utc)
            if post_date < cutoff:
                break  # newest-first iteration: nothing older is worth checking

            if post.shortcode in seen_shortcodes:
                continue

            new_items.append(post_to_queue_item(handle, address_mode, post))
    except Exception as exc:  # noqa: BLE001 - log and move on to the next handle
        print(f"[warn] {handle}: error while fetching posts ({exc}); skipping rest")

    return new_items


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def run() -> Path | None:
    loader = instaloader.Instaloader(
        download_pictures=False,
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        compress_json=False,
        post_metadata_txt_pattern="",
    )

    seen_shortcodes = load_seen_shortcodes()
    cutoff = datetime.now(timezone.utc) - timedelta(days=LOOKBACK_DAYS)

    all_new_items: list[dict] = []
    handles = list(HANDLES.items())

    for i, (handle, address_mode) in enumerate(handles):
        print(f"[info] scraping @{handle} ({address_mode}) ...")
        items = scrape_account(loader, handle, address_mode, seen_shortcodes, cutoff)
        print(f"[info] @{handle}: {len(items)} new post(s)")
        all_new_items.extend(items)
        seen_shortcodes.update(item["shortcode"] for item in items)

        is_last = i == len(handles) - 1
        if not is_last:
            delay = random.uniform(*SLEEP_BETWEEN_ACCOUNTS)
            print(f"[info] sleeping {delay:.1f}s before next account...")
            time.sleep(delay)

    save_seen_shortcodes(seen_shortcodes)

    if not all_new_items:
        print("[info] no new posts this run; not writing a queue file")
        return None

    # likely_party items float to the top; stable sort keeps newest-first
    # ordering within each group.
    all_new_items.sort(key=lambda item: not item["likely_party"])

    REVIEW_QUEUE_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    out_path = REVIEW_QUEUE_DIR / f"queue_{timestamp}.json"
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(all_new_items, f, indent=2, ensure_ascii=False)

    print(f"[info] wrote {len(all_new_items)} new item(s) to {out_path}")
    return out_path


if __name__ == "__main__":
    run()
