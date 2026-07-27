"""
party-feed review console — local-only backend.

Serves the static review UI and exposes three tiny JSON endpoints so the
browser page can read queue files and write the published output. Uses only
the Python standard library — no extra dependencies to install.

Endpoints:
  GET  /                     -> static/index.html
  GET  /static/...           -> static assets (js/css)
  GET  /api/queues           -> ["queue_20260720T030000Z.json", ...] newest first
  GET  /api/queue?file=NAME  -> contents of party-feed/review_queue/NAME
  POST /api/publish          -> body: full reviewed item list (JSON array).
                                 Writes party-feed/published/published.json
                                 containing only items with review.publish
                                 true, and (belt-and-suspenders) strips the
                                 "address" field from any dm-mode item.

No network calls are made by this server itself, and nothing is written
outside party-feed/published/. Run it only on your own machine.
"""

from __future__ import annotations

import json
import re
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse, parse_qs

CONSOLE_DIR = Path(__file__).resolve().parent
PARTY_FEED_DIR = CONSOLE_DIR.parent
STATIC_DIR = CONSOLE_DIR / "static"
QUEUE_DIR = PARTY_FEED_DIR / "review_queue"
PUBLISHED_DIR = PARTY_FEED_DIR / "published"
PUBLISHED_PATH = PUBLISHED_DIR / "published.json"

QUEUE_FILENAME_RE = re.compile(r"^queue_[A-Za-z0-9_\-]+\.json$")

HOST = "127.0.0.1"
PORT = 8765

STATIC_MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
}


def sanitize_review_item(item: dict) -> dict:
    """Second safety net (HARD RULE 3): only an explicitly "public" item may
    carry an address. Fail closed — anything else (dm, missing, unrecognized
    mode) has its address stripped, even if a bug elsewhere in the pipeline
    let one slip through."""
    review = dict(item.get("review") or {})
    if review.get("address_mode") != "public":
        review.pop("address", None)
    cleaned = dict(item)
    cleaned["review"] = review
    return cleaned


class Handler(BaseHTTPRequestHandler):
    server_version = "PartyFeedReviewConsole/1.0"

    def log_message(self, fmt, *args):  # quieter default logging
        print("[server] " + (fmt % args))

    def _send_json(self, status: int, payload) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_file(self, path: Path) -> None:
        if not path.is_file():
            self._send_json(404, {"error": "not found"})
            return
        mime = STATIC_MIME.get(path.suffix, "application/octet-stream")
        body = path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", mime)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):  # noqa: N802 - stdlib naming convention
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/" or path == "":
            self._send_file(STATIC_DIR / "index.html")
            return

        if path.startswith("/static/"):
            rel = path[len("/static/"):]
            candidate = (STATIC_DIR / rel).resolve()
            static_dir_resolved = STATIC_DIR.resolve()
            if static_dir_resolved not in candidate.parents and candidate != static_dir_resolved:
                self._send_json(403, {"error": "forbidden"})
                return
            self._send_file(candidate)
            return

        if path == "/api/queues":
            files = sorted(
                (p.name for p in QUEUE_DIR.glob("queue_*.json") if p.is_file()),
                reverse=True,
            )
            self._send_json(200, files)
            return

        if path == "/api/queue":
            qs = parse_qs(parsed.query)
            filename = (qs.get("file") or [""])[0]
            if not QUEUE_FILENAME_RE.match(filename):
                self._send_json(400, {"error": "invalid filename"})
                return
            file_path = QUEUE_DIR / filename
            if not file_path.is_file():
                self._send_json(404, {"error": "queue file not found"})
                return
            try:
                data = json.loads(file_path.read_text(encoding="utf-8"))
            except json.JSONDecodeError as exc:
                self._send_json(500, {"error": f"bad queue json: {exc}"})
                return
            self._send_json(200, data)
            return

        self._send_json(404, {"error": "not found"})

    def do_POST(self):  # noqa: N802
        parsed = urlparse(self.path)
        if parsed.path != "/api/publish":
            self._send_json(404, {"error": "not found"})
            return

        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length) if length else b""
        try:
            items = json.loads(raw.decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError) as exc:
            self._send_json(400, {"error": f"bad json body: {exc}"})
            return

        if not isinstance(items, list):
            self._send_json(400, {"error": "expected a JSON array of items"})
            return

        publishable = [
            sanitize_review_item(item)
            for item in items
            if isinstance(item, dict) and (item.get("review") or {}).get("publish") is True
        ]

        PUBLISHED_DIR.mkdir(parents=True, exist_ok=True)
        PUBLISHED_PATH.write_text(
            json.dumps(publishable, indent=2, ensure_ascii=False), encoding="utf-8"
        )

        self._send_json(200, {"written": len(publishable), "path": str(PUBLISHED_PATH)})


def run() -> None:
    httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"[server] party-feed review console at http://{HOST}:{PORT}/")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()


if __name__ == "__main__":
    run()
