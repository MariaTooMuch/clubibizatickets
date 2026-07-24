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
  5. For NEW_PRODUCTS (boat trips, Formentera crossings and activities that
     were missing from the site), it also reads each page's official
     description and price, downloads the image, and inserts a new card
     into the Boat Trips or Activities section of index.html using the
     site's existing card design. Review these new cards afterwards —
     the description/price are scraped automatically.

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

# --- New products missing from the site vs. the supplied master link list ---
# (url, operator/venue name, product name, local filename WITHOUT extension, section)
# section is "boats" (image+badge+title+description+price+Book Now button, in a
# <div>) or "activities" (whole card is one clickable <a>, with badge/title/desc/price).
NEW_PRODUCTS = [
    ("https://www.clubtickets.com/boat/capitan-nemo/excursion-es-vedra-capitan-nemo?aff=CT184",
     "Capitan Nemo", "San Antonio to Es Vedra Boat Trip - Daytime", "boat-capitan-nemo-es-vedra", "boats"),
    ("https://www.clubtickets.com/boat/chilli-pepper-boats/chilli-pepper-boat?aff=CT184",
     "Chilli Pepper Boats", "Chilli Pepper Ibiza Boat", "boat-chilli-pepper", "boats"),
    ("https://www.clubtickets.com/boat/excursiones-ibiza/excursion-es-vedra-formentera?aff=CT184",
     "Excursiones Ibiza", "Excursion Es Vedra + Formentera", "boat-excursiones-es-vedra-formentera", "boats"),
    ("https://www.clubtickets.com/boat/ibiza-cruise-crush/ibiza-cruise-crush?aff=CT184",
     "Ibiza Cruise Crush", "Cruise Crush Boat Party", "boat-cruise-crush", "boats"),
    ("https://www.clubtickets.com/boat/lady-virginia-boat/lady-virginia-boat-trip?aff=CT184",
     "Lady Virginia Boat", "Lady Virginia Boat Trip", "boat-lady-virginia", "boats"),
    ("https://www.clubtickets.com/boat/pukka-up/a-day-in-paradise-ibiza?aff=CT184",
     "Pukka Up", "A Day in Paradise Ibiza", "boat-pukka-up-paradise", "boats"),
    # NOTE: the URL supplied for this one had a stray space ("pukka-up-special- boat-party");
    # corrected to the valid slug below. Please double check this against the live site.
    ("https://www.clubtickets.com/boat/pukka-up/pukka-up-special-boat-party?aff=CT184",
     "Pukka Up", "Pukka Up x Belters Only present Waavy Boat Party", "boat-pukka-up-waavy", "boats"),
    ("https://www.clubtickets.com/boat/salvador/salvador-boat-day-trip?aff=CT184",
     "Salvador", "Salvador Day Boat Trip", "boat-salvador-day", "boats"),
    ("https://www.clubtickets.com/boat/salvador/salvador-boat-sunset-trip?aff=CT184",
     "Salvador", "Salvador Sunset Trip", "boat-salvador-sunset", "boats"),
    ("https://www.clubtickets.com/boat/the-beach-hopper/beach-hopper-daytime?aff=CT184",
     "The Beach Hopper", "The Beach Hopper Daytime", "boat-beach-hopper-daytime", "boats"),
    ("https://www.clubtickets.com/boat/the-beach-hopper/beach-hopper-sunset?aff=CT184",
     "The Beach Hopper", "The Beach Hopper Sunset", "boat-beach-hopper-sunset", "boats"),
    ("https://www.clubtickets.com/boat/the-ibz-boat/the-ibz-boat?aff=CT184",
     "The Ibz Boat", "The Ibz Boat", "boat-the-ibz-boat", "boats"),
    ("https://www.clubtickets.com/formentera-day-trip/balearia/balearia?aff=CT184",
     "Balearia", "Ibiza puerto - Formentera", "formentera-balearia", "boats"),
    ("https://www.clubtickets.com/formentera-day-trip/cruceros-portmany/formentera?aff=CT184",
     "Cruceros Portmany", "San Antonio - Formentera", "formentera-cruceros-portmany", "boats"),
    ("https://www.clubtickets.com/formentera-day-trip/santa-eularia-ferry/formentera-experience-by-santa-eularia-ferry?aff=CT184",
     "Santa Eularia Ferry", "Formentera Experience by Santa Eularia Ferry", "formentera-santa-eularia-experience", "boats"),
    ("https://www.clubtickets.com/formentera-day-trip/santa-eularia-ferry/santa-eulalia-formentera-ferry?aff=CT184",
     "Santa Eularia Ferry", "Santa Eulalia - Formentera Ferry", "formentera-santa-eularia-ferry", "boats"),
    ("https://www.clubtickets.com/formentera-day-trip/santa-eularia-ferry/shuttle-ferry-ibiza-es-canar?aff=CT184",
     "Santa Eularia Ferry", "Shuttle Ferry Ibiza - Santa Eularia - Es Canar", "formentera-santa-eularia-shuttle", "boats"),
    ("https://www.clubtickets.com/formentera-day-trip/barco-a-formentera-ulises-cat/brunch-on-the-boat?aff=CT184",
     "Ulises Cat - Sea Experience", "Brunch on the Boat", "formentera-ulises-cat-brunch", "boats"),
    ("https://www.clubtickets.com/formentera-day-trip/barco-a-formentera-ulises-cat/excursion-calas-de-formentera?aff=CT184",
     "Ulises Cat - Sea Experience", "Calas de Formentera Boat Trip", "formentera-ulises-cat-calas", "boats"),
    ("https://www.clubtickets.com/formentera-day-trip/barco-a-formentera-ulises-cat/crystal-waters?aff=CT184",
     "Ulises Cat - Sea Experience", "Crystal Waters Boat Trip", "formentera-ulises-cat-crystal-waters", "boats"),
    ("https://www.clubtickets.com/formentera-day-trip/barco-a-formentera-ulises-cat/ulises-cat-barco-a-formentera?aff=CT184",
     "Ulises Cat - Sea Experience", "Ferry Figueretas & Playa d'en Bossa - Formentera", "formentera-ulises-cat-figueretas", "boats"),
    ("https://www.clubtickets.com/formentera-day-trip/barco-a-formentera-ulises-cat/cala-salada-boat?aff=CT184",
     "Ulises Cat - Sea Experience", "San Antonio - Cala Salada Ferry Boat", "formentera-ulises-cat-cala-salada", "boats"),
    ("https://www.clubtickets.com/formentera-day-trip/barco-a-formentera-ulises-cat/aftersun?aff=CT184",
     "Ulises Cat - Sea Experience", "Sunset Boat Excursion with DJ", "formentera-ulises-cat-aftersun", "boats"),
    ("https://www.clubtickets.com/activities/blue-coral-ibiza/jetski-tours-with-blue-coral?aff=CT184",
     "Blue Coral Ibiza", "Jet Ski Tours with Blue Coral", "activity-blue-coral-jetski", "activities"),
    ("https://www.clubtickets.com/activities/emove-ibiza/electric-motorbike-tour?aff=CT184",
     "Emove Ibiza", "Electric Motocross Tour", "activity-emove-electric-motocross", "activities"),
    ("https://www.clubtickets.com/activities/excursiones/jeep-safari-north-tour?aff=CT184",
     "Excursiones Al Sabini", "Jeep Safari North Tour", "activity-jeep-safari-north", "activities"),
    ("https://www.clubtickets.com/activities/ibiza-buggy-adventure/ibiza-buggy-adventure?aff=CT184",
     "Ibiza Buggy Adventure", "Ibiza Buggy Adventure from San Antonio", "activity-buggy-adventure", "activities"),
    ("https://www.clubtickets.com/activities/ibiza-buggy-adventure/ibiza-buggy-adventure-quad-tours?aff=CT184",
     "Ibiza Buggy Adventure", "Ibiza Quad Adventure from San Antonio", "activity-quad-adventure", "activities"),
    ("https://www.clubtickets.com/activities/ibiza-jet-ski-beach/jet-ski-san-antonio-ibiza-jet-ski-beach?aff=CT184",
     "Ibiza Jet Ski Beach", "Jet Ski in San Antonio - Ibiza Jet Ski Beach", "activity-jet-ski-beach-san-antonio", "activities"),
    ("https://www.clubtickets.com/activities/into-the-island/into-the-island?aff=CT184",
     "INTO THE ISLAND", "4x4 Safari Ibiza Tour by Into the Island", "activity-into-the-island-4x4", "activities"),
    ("https://www.clubtickets.com/activities/into-the-island/into-the-island-combo-tour?aff=CT184",
     "INTO THE ISLAND", "Into the Island - Boat, 4x4 & Es Vedra Sunset Adventure", "activity-into-the-island-combo", "activities"),
    ("https://www.clubtickets.com/activities/jet-blast-ibiza/jet-ski-bahia-san-antonio-ibiza?aff=CT184",
     "Jet Blast Ibiza", "Jet Ski in San Antonio Bay", "activity-jet-blast-san-antonio", "activities"),
    ("https://www.clubtickets.com/activities/sup-paradise-ibiza/2h-sunset-boat-trip-with-paddle-surf-lesson?aff=CT184",
     "SUP Paradise Ibiza", "2h Sunset Boat Trip with Paddle Surf Lesson", "activity-sup-paradise-sunset", "activities"),
    ("https://www.clubtickets.com/activities/sup-paradise-ibiza/3h-boat-trip-with-paddle-surf-lesson-snorkeling?aff=CT184",
     "SUP Paradise Ibiza", "3h Boat Trip with Paddle Surf Lesson - Snorkeling", "activity-sup-paradise-snorkel", "activities"),
    ("https://www.clubtickets.com/activities/take-off/speed-boat-adventure?aff=CT184",
     "TAKE OFF", "Cave and Beach Hopping Boat Tour", "activity-take-off-cave-hopping", "activities"),
    ("https://www.clubtickets.com/activities/take-off/barco-con-juguetes-acuaticos-de-lujo?aff=CT184",
     "TAKE OFF", "Luxury Water Toys Boat Experience", "activity-take-off-water-toys", "activities"),
]

OG_DESC_RE = re.compile(
    r'<meta[^>]+property=["\']og:description["\'][^>]+content=["\']([^"\']+)["\']',
    re.IGNORECASE,
)
PRICE_RE = re.compile(r'(?:€|&euro;|&#8364;)\s?(\d+(?:[.,]\d{2})?)')

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


def extract_meta(html):
    desc_m = OG_DESC_RE.search(html)
    description = desc_m.group(1).strip() if desc_m else None
    price_m = PRICE_RE.search(html)
    price = price_m.group(1).replace(",", ".") if price_m else None
    if price and "." not in price:
        price = price + ".00"
    return description, price


def build_boat_card(image_path, alt, badge, title, description, price, url):
    price_html = (
        f'<div>From <strong style="font-size:20px;font-weight:800;color:#fff">€{price}</strong></div>'
        if price else ""
    )
    desc = description or "See full details and availability on ClubTickets."
    return (
        '<div style="background:#111118;border:1px solid rgba(255,255,255,.07);border-radius:12px;'
        'padding:22px;display:flex;flex-direction:column;gap:10px">'
        f'<img onerror="this.onerror=null;this.src=\'images/hero-01-ibiza-nightlife-show.webp\'" '
        f'src="{image_path}" alt="{alt}" loading="lazy" '
        'style="width:100%;height:130px;object-fit:cover;border-radius:8px;margin:-22px -22px 12px;width:calc(100% + 44px)">'
        '<span style="width:fit-content;background:rgba(124,58,237,.12);border:1px solid rgba(124,58,237,.22);'
        f'color:#a78bfa;font-size:10px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;'
        f'padding:3px 10px;border-radius:20px">{badge}</span>'
        f'<h3 style="font-size:15px;font-weight:700;margin:0">{title}</h3>'
        f'<p style="font-size:13px;color:rgba(255,255,255,.5);line-height:1.5;flex:1;margin:0">{desc}</p>'
        f'{price_html}'
        f'<a href="{url}" target="_blank" style="display:block;background:linear-gradient(135deg,#7c3aed,#a855f7);'
        'color:#fff;padding:10px;border-radius:8px;text-align:center;font-size:13px;font-weight:600;'
        'text-decoration:none">Book Now →</a></div>'
    )


def build_activity_card(image_path, alt, badge, title, description, price, url):
    price_html = (
        f'<div style="font-size:12px;color:rgba(255,255,255,.4)">From '
        f'<strong style="font-size:17px;font-weight:800;color:#fff">€{price}</strong></div>'
        if price else ""
    )
    desc = description or "See full details and availability on ClubTickets."
    return (
        f'<a href="{url}" target="_blank" style="background:#111118;border:1px solid rgba(255,255,255,.07);'
        'border-radius:12px;padding:18px;text-decoration:none;color:#fff;display:flex;flex-direction:column;gap:7px" '
        'onmouseover="this.style.borderColor=\'rgba(124,58,237,.3)\'" '
        'onmouseout="this.style.borderColor=\'rgba(255,255,255,.07)\'">'
        f'<img onerror="this.onerror=null;this.src=\'images/hero-01-ibiza-nightlife-show.webp\'" '
        f'src="{image_path}" alt="{alt}" loading="lazy" '
        'style="width:100%;height:110px;object-fit:cover;border-radius:8px;margin:-18px -18px 10px;width:calc(100% + 36px)">'
        f'<span style="font-size:10px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;'
        f'color:#a78bfa">{badge}</span>'
        f'<h3 style="font-size:13px;font-weight:700;margin:0">{title}</h3>'
        f'<p style="font-size:12px;color:rgba(255,255,255,.45);line-height:1.45;flex:1;margin:0">{desc}</p>'
        f'{price_html}</a>'
    )


def process_new_products():
    if not os.path.exists(INDEX_HTML):
        print("index.html not found, skipping new product cards.")
        return []

    with open(INDEX_HTML, "r", encoding="utf-8") as f:
        html = f.read()

    results = []
    boats_cards = []
    activities_cards = []

    for url, operator, title, base_name, section in NEW_PRODUCTS:
        label = f"{operator} - {title}"
        print(f"\n=== NEW: {label} ===")
        print(f"Page: {url}")
        try:
            html_bytes, _ = fetch(url)
            page_html = html_bytes.decode("utf-8", errors="replace")
        except Exception as e:
            print(f"  FAILED to load page: {e}")
            results.append((label, "FAILED (page load)", str(e)))
            continue

        m = OG_IMAGE_RE.search(page_html) or OG_IMAGE_RE_ALT.search(page_html)
        description, price = extract_meta(page_html)
        print(f"  description: {description!r}")
        print(f"  price: {price!r}")

        image_path = "images/hero-01-ibiza-nightlife-show.webp"  # generic fallback if download fails
        if m:
            image_url = m.group(1)
            try:
                img_bytes, content_type = fetch(image_url)
                ext = guess_ext(image_url, content_type)
                filename = base_name + ext
                with open(os.path.join(IMAGES_DIR, filename), "wb") as f:
                    f.write(img_bytes)
                image_path = f"images/{filename}"
                print(f"  Saved: {image_path} ({len(img_bytes):,} bytes)")
            except Exception as e:
                print(f"  FAILED to download image: {e}")
        else:
            print("  No og:image found, will use generic fallback image.")

        card_fn = build_boat_card if section == "boats" else build_activity_card
        card_html = card_fn(image_path, title, operator, title, description, price, url)
        (boats_cards if section == "boats" else activities_cards).append(card_html)

        results.append((label, "OK", image_path))
        time.sleep(1)

    if boats_cards:
        anchor = html.find('<section id="boats"')
        insert_at = html.find("</section>", anchor)
        html = html[:insert_at] + "".join(boats_cards) + html[insert_at:]
    if activities_cards:
        anchor = html.find('<section id="activities"')
        insert_at = html.find("</section>", anchor)
        html = html[:insert_at] + "".join(activities_cards) + html[insert_at:]

    with open(INDEX_HTML, "w", encoding="utf-8") as f:
        f.write(html)

    return results


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

    product_results = process_new_products()

    print("\n\n================ SUMMARY ================")
    ok = sum(1 for r in results if r[2] == "OK")
    fail = len(results) - ok
    for label, base_name, status, extra in results:
        print(f"  [{status}] {label}")
    print(f"\n{ok} of {len(results)} existing images downloaded successfully.")
    if patched:
        print(f"index.html updated for {patched} image(s) with a non-.webp extension.")
    if fail:
        print(f"\n{fail} item(s) failed. Re-run this script later to retry, or check "
              f"the ClubTickets URL manually for those items.")

    if product_results:
        p_ok = sum(1 for r in product_results if r[1] == "OK")
        print(f"\n{p_ok} of {len(product_results)} new product cards added to index.html:")
        for label, status, extra in product_results:
            print(f"  [{status}] {label}")
        print("\nPlease review the new cards' descriptions/prices in index.html — they were")
        print("scraped automatically and may need light editing.")
    print("===========================================")


if __name__ == "__main__":
    sys.exit(main())
