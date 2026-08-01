/*
 * Club Ibiza Tickets — shared ambassador tracking client.
 * Works standalone (no backend) using localStorage as the event store.
 * When window.CIT_SUPABASE_URL / window.CIT_SUPABASE_ANON_KEY are set AND
 * the supabase-js library is loaded, events are also written to Supabase
 * (schema: supabase/schema.sql). Until then, this is the local demo store
 * the admin/ambassador dashboards read from.
 *
 * Reusable across every ambassador page, not just Bella's.
 */
(function (global) {
  var ATTR_KEY = 'cit_ambassador';
  var VISITOR_KEY = 'cit_visitor_id';
  var EVENTS_KEY = 'cit_events';
  var ATTR_DAYS = 30;

  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function getVisitorId() {
    var id = null;
    try { id = localStorage.getItem(VISITOR_KEY); } catch (e) {}
    if (!id) {
      id = uuid();
      try { localStorage.setItem(VISITOR_KEY, id); } catch (e) {}
    }
    return id;
  }

  function deviceCategory() {
    var w = global.innerWidth || 1024;
    if (w < 640) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  }

  function currentLang() {
    try { return localStorage.getItem('cit_lang') || 'en'; } catch (e) { return 'en'; }
  }

  function readAttribution() {
    try {
      var raw = JSON.parse(localStorage.getItem(ATTR_KEY));
      if (raw && raw.exp && raw.exp > Date.now()) return raw;
    } catch (e) {}
    return null;
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
      if (m) code = CIT_AMBASSADOR_CODE_BY_SLUG(m[1]);
    }
    if (!code) return readAttribution();

    var now = Date.now();
    var existing = readAttribution();
    if (!existing || existing.code !== code) {
      existing = {
        code: code,
        visitorId: getVisitorId(),
        since: now,
        exp: now + ATTR_DAYS * 24 * 60 * 60 * 1000,
        entryPage: global.location.pathname + global.location.search + global.location.hash,
        referralSource: (document.referrer ? new URL(document.referrer).hostname : 'direct')
      };
      try { localStorage.setItem(ATTR_KEY, JSON.stringify(existing)); } catch (e) {}
      track('page_view', { label: 'attribution_start' });
    }
    return existing;
  }

  // Maps a page slug (from the URL) to its ambassador code. Extend as new
  // ambassadors are added — kept as a small static map so this file has no
  // dependency on a backend to resolve attribution.
  function CIT_AMBASSADOR_CODE_BY_SLUG(slug) {
    var map = { bella: 'BELLA01' };
    return map[slug] || null;
  }

  function track(type, payload) {
    payload = payload || {};
    var attribution = readAttribution();
    if (!attribution) return; // no ambassador attribution active — nothing to attribute this event to
    var event = {
      id: uuid(),
      ambassadorCode: attribution.code,
      visitorId: attribution.visitorId,
      type: type,
      productCategory: payload.category || null,
      venue: payload.venue || null,
      eventName: payload.label || null,
      destinationUrl: payload.url || null,
      language: currentLang(),
      device: deviceCategory(),
      occurredAt: new Date().toISOString()
    };
    try {
      var log = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
      log.push(event);
      if (log.length > 500) log = log.slice(-500);
      localStorage.setItem(EVENTS_KEY, JSON.stringify(log));
    } catch (e) {}

    if (global.CIT_SUPABASE_URL && global.CIT_SUPABASE_ANON_KEY && global.supabase) {
      try {
        var client = global.__citSupabase || (global.__citSupabase = global.supabase.createClient(global.CIT_SUPABASE_URL, global.CIT_SUPABASE_ANON_KEY));
        client.from('click_events').insert({
          ambassador_id: null, // resolved server-side via a view/RPC keyed on ambassador code in production
          event_type: type,
          product_category: event.productCategory,
          venue: event.venue,
          event_name: event.eventName,
          destination_url: event.destinationUrl,
          language: event.language,
          device_category: event.device
        }).then(function(){}, function(){});
      } catch (e) {}
    }
    return event;
  }

  function trackVipEnquiry(venue, payload) {
    var attribution = readAttribution();
    var record = {
      id: uuid(),
      ambassadorCode: attribution ? attribution.code : null,
      venue: venue,
      preferredDate: payload.date,
      guests: payload.guests,
      customerName: payload.name,
      createdAt: new Date().toISOString(),
      enquiryStatus: 'new',
      reservationStatus: 'pending',
      commissionStatus: 'not_applicable'
    };
    try {
      var log = JSON.parse(localStorage.getItem('cit_vip_enquiries') || '[]');
      log.push(record);
      localStorage.setItem('cit_vip_enquiries', JSON.stringify(log));
    } catch (e) {}
    track('vip_enquiry_click', { category: 'vip', venue: venue, label: 'VIP enquiry — ' + venue });
    return record;
  }

  // Link generator: always places ?ref=CODE before the #hash so it survives.
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
    buildLink: buildLink,
    getVisitorId: getVisitorId
  };
})(window);
