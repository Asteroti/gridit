import manifestJSON from '__STATIC_CONTENT_MANIFEST';
const manifest = JSON.parse(manifestJSON);

const VALID_EVENTS = new Set(['downloaded', 'hearted']);
const TOP_COUNTRY_LIMIT = 12;
const COUNTERS_CACHE_TTL = 60;
const RATE_LIMIT_MAX = 30;          // events per window per identity
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_SALT = 'gridit-rl-v1';

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      if (url.pathname === '/api/event' && request.method === 'POST') {
        return handleEvent(request, env);
      }
      if (url.pathname === '/api/counters' && request.method === 'GET') {
        return handleCounters(request, env);
      }

      return serveStatic(url, env);
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(`Worker error: ${error.message}`, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};

async function handleEvent(request, env) {
  if (!env.DB) {
    return jsonResponse({ ok: false, error: 'DB not configured' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'bad json' }, 400);
  }

  const event = body && body.event;
  if (!VALID_EVENTS.has(event)) {
    return jsonResponse({ ok: false, error: 'bad event' }, 400);
  }

  const limited = await checkRateLimit(env, request);
  if (limited.over) {
    return jsonResponse(
      { ok: false, error: 'rate_limited', retryAfter: limited.retryAfter },
      429,
      { 'Retry-After': String(limited.retryAfter) }
    );
  }

  const country = (request.cf && request.cf.country) || 'XX';
  const week = currentISOWeek();

  await env.DB.prepare(
    'INSERT INTO counters (event, country, week, count) VALUES (?, ?, ?, 1) ' +
    'ON CONFLICT(event, country, week) DO UPDATE SET count = count + 1'
  ).bind(event, country, week).run();

  return jsonResponse({ ok: true, country });
}


async function checkRateLimit(env, request) {
  if (!env.RL) {
    // KV not configured — fail open. Counter still works; rate limit doesn't.
    return { over: false };
  }

  const identity = await rateLimitIdentity(request);
  const key = `rl:${identity}`;
  const now = Date.now();

  const raw = await env.RL.get(key, { type: 'json' });

  if (raw && raw.resetAt > now) {
    if (raw.count >= RATE_LIMIT_MAX) {
      return { over: true, retryAfter: Math.ceil((raw.resetAt - now) / 1000) };
    }
    await env.RL.put(
      key,
      JSON.stringify({ count: raw.count + 1, resetAt: raw.resetAt }),
      { expirationTtl: Math.max(1, Math.ceil((raw.resetAt - now) / 1000)) }
    );
  } else {
    await env.RL.put(
      key,
      JSON.stringify({ count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS }),
      { expirationTtl: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000) }
    );
  }
  return { over: false };
}


async function rateLimitIdentity(request) {
  // Prefer session token (lives in client localStorage); falls back to hashed IP.
  // Both are derived/hashed — neither is ever persisted beyond the rate-limit
  // window (the KV entry has a 60s TTL and disappears on its own).
  const token = request.headers.get('X-Session-Token');
  if (token && /^[a-zA-Z0-9_-]{8,128}$/.test(token)) {
    return 't:' + token;
  }
  const ip = request.headers.get('CF-Connecting-IP') || '';
  return 'i:' + (await sha256Hex(RATE_LIMIT_SALT + ip));
}


async function sha256Hex(input) {
  const enc = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return [...new Uint8Array(buf)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function handleCounters(request, env) {
  if (!env.DB) {
    return jsonResponse({ ok: false, error: 'DB not configured' }, 500);
  }

  const week = currentISOWeek();

  const [totals, countries, byCountryHearted, byCountryGridded, weeklyHearted] = await Promise.all([
    env.DB.prepare("SELECT event, SUM(count) AS c FROM counters GROUP BY event").all(),
    env.DB.prepare("SELECT COUNT(DISTINCT country) AS c FROM counters").first(),
    env.DB.prepare(
      "SELECT country, SUM(count) AS c FROM counters " +
      "WHERE event='hearted' GROUP BY country ORDER BY c DESC LIMIT ?"
    ).bind(TOP_COUNTRY_LIMIT).all(),
    env.DB.prepare(
      "SELECT country, SUM(count) AS c FROM counters " +
      "WHERE event='downloaded' GROUP BY country ORDER BY c DESC LIMIT ?"
    ).bind(TOP_COUNTRY_LIMIT).all(),
    env.DB.prepare(
      "SELECT country, SUM(count) AS c FROM counters " +
      "WHERE event='hearted' AND week=? GROUP BY country ORDER BY c DESC LIMIT 1"
    ).bind(week).first()
  ]);

  const totalsMap = {};
  for (const row of totals.results) totalsMap[row.event] = row.c;

  const payload = {
    totalDownloaded: totalsMap.downloaded || 0,
    totalHearted: totalsMap.hearted || 0,
    totalCountries: (countries && countries.c) || 0,
    heartsByCountry: byCountryHearted.results.map(r => ({ country: r.country, count: r.c })),
    griddersByCountry: byCountryGridded.results.map(r => ({ country: r.country, count: r.c })),
    spotlight: weeklyHearted
      ? { country: weeklyHearted.country, count: weeklyHearted.c }
      : { country: '', count: 0 },
    yourCountry: (request.cf && request.cf.country) || ''
  };

  // private cache so the user-specific yourCountry isn't shared via CDN
  return jsonResponse(payload, 200, { 'Cache-Control': `private, max-age=${COUNTERS_CACHE_TTL}` });
}

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders }
  });
}

function currentISOWeek() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

async function serveStatic(url, env) {
  if (!env.__STATIC_CONTENT) {
    return new Response('__STATIC_CONTENT binding is not available.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  let path = url.pathname;
  if (path === '/' || path === '') path = '/index.html';
  const key = path.replace(/^\//, '');
  const hashedKey = manifest[key];

  if (!hashedKey) {
    return new Response('File not found', { status: 404 });
  }

  const value = await env.__STATIC_CONTENT.get(hashedKey, 'text');
  if (value === null) {
    return new Response('File not found', { status: 404 });
  }

  return new Response(value, {
    headers: { 'Content-Type': getContentType(key) }
  });
}

function getContentType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const types = {
    html: 'text/html',
    js: 'application/javascript',
    css: 'text/css',
    json: 'application/json',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    ico: 'image/x-icon'
  };
  return types[ext] || 'text/plain';
}
