/*
 * Club Ibiza Tickets — lightweight ambassador attribution (phase 1).
 *
 * Stores which ambassador referred a visitor for 30 days and pushes
 * page-view / ticket-click / VIP-enquiry events into the site's existing
 * GTM dataLayer. No database, no dashboard, no automatic commission
 * calculation — confirmed sales and commissions are reconciled manually
 * from ClubTickets reports. Structured so a real backend + dashboard can
 * be added in a later phase without changing how pages call this file.
 *
 * Reusable across every ambassador page, not just Bella's.
 */
(function (global) {
  var ATTR_KEY = 'cit_ambassador';
  var ATTR_DAYS = 30;

  function readAttribution() {
    try {
      var raw = JSON.parse(localStorage.getItem(ATTR_KEY));
      if (raw && raw.exp && raw.exp > Date.now()) return raw;
    } catch (e) {}
    return null;
  }

  // Maps a page slug (from the URL) to its ambassador code. Extend as new
  // ambassadors are added.
  function ambassadorCodeBySlug(slug) {
    var map = { bella: 'BELLA01' };
    return map[slug] || null;
  }

  // Capture attribution from: visiting /ambassadors/{code}/ directly, or any
  // page with ?ref=CODE in the query string (placed before the #hash so it
  // always survives — e.g. /?ref=BELLA01#unvrs).
  function captureAttribution(explicitCode) {
    var code = explicitCode || null;
    if (!code) {
      var params = new URLSearchParams(global.location.search);
      code = params.get('ref');
    }
    if (!code) {
      var m = global.location.pathname.match(/\/ambassadors\/([a-z0-9-]+)\/?/i);
      if (m) code = ambassadorCodeBySlug(m[1]);
    }
    if (!code) return readAttribution();

    var now = Date.now();
    var existing = readAttribution();
    if (!existing || existing.code !== code) {
      existing = {
        code: code,
        since: now,
        exp: now + ATTR_DAYS * 24 * 60 * 60 * 1000,
        entryPage: global.location.pathname + global.location.search + global.location.hash
      };
      try { localStorage.setItem(ATTR_KEY, JSON.stringify(existing)); } catch (e) {}
    }
    track('page_view', {});
    return existing;
  }

  // Pushes a tracked event into the existing GTM dataLayer. Clicks are
  // never sales — confirmed tickets are reconciled manually from
  // ClubTickets reports, kept entirely separate from this event stream.
  function track(type, payload) {
    payload = payload || {};
    var attribution = readAttribution();
    if (!attribution) return;
    global.dataLayer = global.dataLayer || [];
    global.dataLayer.push({
      event: 'ambassador_' + type,
      ambassador_code: attribution.code,
      product_category: payload.category || undefined,
      venue: payload.venue || undefined,
      event_label: payload.label || undefined,
      destination_url: payload.url || undefined
    });
  }

  function trackVipEnquiry(venue) {
    track('vip_enquiry', { category: 'vip', venue: venue, label: 'VIP enquiry — ' + venue });
  }

  // Always places ?ref=CODE before the #hash — the only ordering that
  // survives on a hash-routed site.
  function buildLink(origin, code, opts) {
    opts = opts || {};
    var url = origin.replace(/\/$/, '') + '/?ref=' + encodeURIComponent(code);
    if (opts.hash) url += '#' + opts.hash;
    return url;
  }

  global.CIT = {
    captureAttribution: captureAttribution,
    readAttribution: readAttribution,
    track: track,
    trackVipEnquiry: trackVipEnquiry,
    buildLink: buildLink
  };
})(window);
