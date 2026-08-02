#!/usr/bin/env python3
"""
Club Ibiza Tickets — static site builder.

Single source of truth for shared content. Every page (the main site and
every Ibiza Insider profile) is assembled from:

  shared/head-style.html      <- preconnects, fonts, <style> (shared CSS)
  shared/head-tracking.html   <- CIT attribution + GTM scripts (shared)
  shared/nav.html             <- GTM noscript + nav bar + mobile menu (shared)
  shared/main.html            <- everything after the hero: UNVRS, Hi, Ushuaia,
                                  VIP tables, More Clubs, Boats, Activities,
                                  Blog, About, Help, FAQ, footer (shared)

Only two things are page-specific: the <head> meta/title/JSON-LD block, and
the hero section. Edit shared/main.html once and re-run this script — every
page picks up the change automatically.

Usage: python3 build.py
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))


def read(path):
    with open(os.path.join(ROOT, path), encoding='utf-8') as f:
        return f.read()


def write(path, content):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(content)


SHARED_STYLE = read('shared/head-style.html')
SHARED_TRACKING = read('shared/head-tracking.html')
SHARED_NAV = read('shared/nav.html')
SHARED_MAIN = read('shared/main.html')

PRE = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n'
FAVICONS = '<link rel="icon" href="/favicon.ico" sizes="any">\n<link rel="icon" type="image/png" href="/favicon.png">\n<link rel="apple-touch-icon" href="/favicon.png">\n'


def build_page(out_path, page_meta, extra_head, hero_html, root_prefix='/'):
    """
    page_meta: raw <meta description/robots/og:.../title> block (page-specific)
    extra_head: raw extra <head> content specific to this page (e.g. JSON-LD,
                or an ambassador profile config script) — inserted after the
                shared style block and before the shared tracking scripts.
    hero_html: the page's own hero section markup
    root_prefix: '/' for pages at the site root path depth used by shared
                 nav/main links (they already use root-relative or '#'
                 links, so this is unused today but kept for future nested
                 pages that might need path rewriting)
    """
    html = (
        PRE
        + page_meta
        + SHARED_STYLE
        + extra_head
        + SHARED_TRACKING
        + FAVICONS
        + '</head>\n<body>'
        + SHARED_NAV
        + hero_html
        + SHARED_MAIN
        + '</body>\n</html>'
    )
    write(out_path, html)
    return html


if __name__ == '__main__':
    # ---- Main site (index.html) ----
    index_meta = read('pages/index.meta.html')
    index_jsonld = read('pages/index.jsonld.html')
    index_hero = read('pages/index.hero.html')
    build_page('index.html', index_meta, index_jsonld, index_hero)
    print('Built index.html')

    # ---- Ibiza Insiders profiles ----
    insiders_dir = os.path.join(ROOT, 'pages', 'ibiza-insiders')
    if os.path.isdir(insiders_dir):
        for slug in sorted(os.listdir(insiders_dir)):
            profile_dir = os.path.join(insiders_dir, slug)
            meta_path = os.path.join('pages', 'ibiza-insiders', slug, 'meta.html')
            hero_path = os.path.join('pages', 'ibiza-insiders', slug, 'hero.html')
            if not (os.path.isfile(os.path.join(ROOT, meta_path)) and os.path.isfile(os.path.join(ROOT, hero_path))):
                continue
            meta = read(meta_path)
            hero = read(hero_path)
            out = f'ibiza-insiders/{slug}/index.html'
            build_page(out, meta, '', hero)
            print(f'Built {out}')
