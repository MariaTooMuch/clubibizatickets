#!/usr/bin/env python3
"""
Club Ibiza Tickets - official image downloader.

Run this on a computer with normal internet access (Windows users:
double-click DOWNLOAD_OFFICIAL_IMAGES.bat in the project root instead of
running this file directly).

What it does:
  1. Opens each ClubTickets URL listed in MANIFEST below.
  2. Reads the page's official <meta property="og:image"> tag.
  3. Downloads that exact image and saves it inside images/ using the
     filename already referenced by index.html for that event/club.
  4. If the real image format isn't .webp, it patches index.html so the
     <img src="..."> for that item points at the correct file extension.

No third-party packages are required (stdlib only: urllib, re, os).
"""

import os
import re
import sys
import time
import urllib.request
import urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_DIR = os.path.join(ROOT, "images")
INDEX_HTML = os.path.join(ROOT, "index.html")

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)

# (ClubTickets URL, local filename WITHOUT extension, human label for the report)
MANIFEST = [
    ("https://www.clubtickets.com/clubbing/hi-ibiza/dom-dolla?aff=CT184",
     "hi-ibiza-dom-dolla", "Hi Ibiza - Dom Dolla"),
    ("https://www.clubtickets.com/clubbing/ushuaia-ibiza/ants?aff=CT184",
     "ushuaia-ants", "Ushuaia Ibiza - ANTS"),
    ("https://www.clubtickets.com/clubbing/ushuaia-ibiza/calvin-harris?aff=CT184",
     "ushuaia-calvin-harris", "Ushuaia Ibiza - Calvin Harris"),
    ("https://www.clubtickets.com/clubbing/ushuaia-ibiza/calvin-harris-t?aff=CT184",
     "ushuaia-calvin-harris-friday", "Ushuaia Ibiza - Calvin Harris. (Fridays)"),
    ("https://www.clubtickets.com/clubbing/ushuaia-ibiza/f-me-im-famous?aff=CT184",
     "ushuaia-f-me-im-famous", "Ushuaia Ibiza - F*** Me I'm Famous! by David Guetta"),
    ("https://www.clubtickets.com/clubbing/ushuaia-ibiza/martin-garrix?aff=CT184",
     "ushuaia-martin-garrix", "Ushuaia Ibiza - Martin Garrix"),
    ("https://www.clubtickets.com/clubbing/ushuaia-ibiza/ozuna?aff=CT184",
     "ushuaia-ozuna", "Ushuaia Ibiza - Ozuna"),
    ("https://www.clubtickets.com/clubbing/ushuaia-ibiza/tomorrowland-and-dimitri-vegas-like-mike?aff=CT184",
     "ushuaia-tomorrowland-dimitri-vegas-like-mike", "Ushuaia Ibiza - Tomorrowland & Dimitri Vegas & Like Mike"),
    ("https://www.clubtickets.com/clubbing/playa-soleil?aff=CT184",
     "club-playa-soleil", "Playa Soleil"),
    ("https://www.clubtickets.com/clubbing/club-chinois-ibiza?aff=CT184",
     "club-chinois-ibiza", "Chinois Ibiza"),
    ("https://www.clubtickets.com/clubbing/ibiza-rocks?aff=CT184",
     "club-ibiza-rocks", "Ibiza Rocks"),
    ("https://www.clubtickets.com/clubbing/es-paradis?aff=CT184",
     "club-es-paradis", "Es Paradis"),
    ("https://www.clubtickets.com/clubbing/lio?aff=CT184",
     "club-lio-ibiza", "Lio Ibiza"),
    ("https://www.clubtickets.com/clubbing/unvrs-ibiza/artcore?aff=CT184",
     "unvrs-artcore", "UNVRS - Indira Paganotto presents ARTCORE"),
    ("https://www.clubtickets.com/clubbing/unvrs-ibiza/no-art-ibiza?aff=CT184",
     "unvrs-no-art-ibiza", "UNVRS - No Art Ibiza"),
    ("https://www.clubtickets.com/clubbing/ushuaia-ibiza/hugel?aff=CT184",
     "ushuaia-hugel", "Ushuaia Ibiza - Hugel presents Make the Girls Dance"),
]

OG_IMAGE_RE = re.compile(
    r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']',
    re.IGNORECASE,
)
OG_IMAGE_RE_ALT = re.compile(
    r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']',
    re.IGNORECASE,
)


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read(), resp.headers.get("Content-Type", "")


def guess_ext(url, content_type):
    for ext in (".webp", ".jpg", ".jpeg", ".png", ".gif"):
        if url.lower().split("?")[0].endswith(ext):
            return ".jpg" if ext == ".jpeg" else ext
    if "webp" in content_type:
        return ".webp"
    if "png" in content_type:
        return ".png"
    if "gif" in content_type:
        return ".gif"
    return ".jpg"


def main():
    os.makedirs(IMAGES_DIR, exist_ok=True)
    results = []

    for url, base_name, label in MANIFEST:
        print(f"\n=== {label} ===")
        print(f"Page: {url}")
        try:
            html_bytes, _ = fetch(url)
            html = html_bytes.decode("utf-8", errors="replace")
        except Exception as e:
            print(f"  FAILED to load page: {e}")
            results.append((label, base_name, "FAILED (page load)", str(e)))
            continue

        m = OG_IMAGE_RE.search(html) or OG_IMAGE_RE_ALT.search(html)
        if not m:
            print("  FAILED: no og:image meta tag found on page")
            results.append((label, base_name, "FAILED (no og:image)", ""))
            continue

        image_url = m.group(1)
        print(f"  og:image: {image_url}")

        try:
            img_bytes, content_type = fetch(image_url)
        except Exception as e:
            print(f"  FAILED to download image: {e}")
            results.append((label, base_name, "FAILED (image download)", str(e)))
            continue

        ext = guess_ext(image_url, content_type)
        filename = base_name + ext
        out_path = os.path.join(IMAGES_DIR, filename)
        with open(out_path, "wb") as f:
            f.write(img_bytes)

        print(f"  Saved: images/{filename} ({len(img_bytes):,} bytes)")
        results.append((label, base_name, "OK", filename))
        time.sleep(1)

    # Patch index.html so each src points at the real saved extension
    patched = 0
    if os.path.exists(INDEX_HTML):
        with open(INDEX_HTML, "r", encoding="utf-8") as f:
            html = f.read()
        for label, base_name, status, extra in results:
            if status == "OK":
                placeholder = f"images/{base_name}.webp"
                real = f"images/{extra}"
                if real != placeholder and placeholder in html:
                    html = html.replace(placeholder, real)
                    patched += 1
        with open(INDEX_HTML, "w", encoding="utf-8") as f:
            f.write(html)

    print("\n\n================ SUMMARY ================")
    ok = sum(1 for r in results if r[2] == "OK")
    fail = len(results) - ok
    for label, base_name, status, extra in results:
        print(f"  [{status}] {label}")
    print(f"\n{ok} of {len(results)} images downloaded successfully.")
    if patched:
        print(f"index.html updated for {patched} image(s) with a non-.webp extension.")
    if fail:
        print(f"\n{fail} item(s) failed. Re-run this script later to retry, or check "
              f"the ClubTickets URL manually for those items.")
    print("===========================================")


if __name__ == "__main__":
    sys.exit(main())
