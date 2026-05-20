-- Community counter schema for Gridit.
-- One row per (event, country, week). Aggregated at query time.
-- No PII: country comes from request.cf.country, never from IP storage.

CREATE TABLE IF NOT EXISTS counters (
  event   TEXT NOT NULL,    -- 'downloaded' | 'hearted'
  country TEXT NOT NULL,    -- ISO 3166-1 alpha-2, e.g. 'AR', 'JP'. 'XX' if unknown.
  week    TEXT NOT NULL,    -- ISO week 'YYYY-Www', for spotlight rotation
  count   INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (event, country, week)
);

CREATE INDEX IF NOT EXISTS counters_event_idx ON counters (event);
CREATE INDEX IF NOT EXISTS counters_event_week_idx ON counters (event, week);
