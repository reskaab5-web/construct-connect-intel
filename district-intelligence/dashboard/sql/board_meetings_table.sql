-- ============================================================
-- board_meetings table
-- Stores the document index for scraped board meeting minutes,
-- agendas, and transcripts. One row per unique source URL.
-- ============================================================

create table if not exists board_meetings (
  id               uuid default gen_random_uuid() primary key,
  district_id      uuid references districts(id) on delete cascade,
  org_id           uuid not null,
  meeting_date     date,
  title            text,
  source_url       text not null unique,
  source_platform  text,      -- 'boarddocs' | 'granicus' | 'district_site' | 'gnews'
  document_type    text,      -- 'minutes' | 'agenda' | 'transcript' | 'news' | 'unknown'
  raw_text         text,      -- full extracted text (up to 50k chars)
  top_verticals    jsonb,     -- [{vertical_id, score, confidence, top_terms}]
  customer_alerts  jsonb,     -- [{customer_id, label, combined_score, top_vertical}]
  scraped_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- Indexes
create index if not exists idx_board_meetings_district on board_meetings(district_id);
create index if not exists idx_board_meetings_date     on board_meetings(meeting_date desc);
create index if not exists idx_board_meetings_org      on board_meetings(org_id);
create index if not exists idx_board_meetings_platform on board_meetings(source_platform);
create index if not exists idx_board_meetings_type     on board_meetings(document_type);

-- GIN index for JSONB queries (e.g. find all minutes with life_safety_fire signal)
create index if not exists idx_board_meetings_verticals on board_meetings using gin(top_verticals);
create index if not exists idx_board_meetings_customers on board_meetings using gin(customer_alerts);

-- RLS (optional — enable if using row-level security)
-- alter table board_meetings enable row level security;

-- ── Useful queries ──────────────────────────────────────────────────────────

-- Recent minutes with Lightspeed signal:
-- select district_id, meeting_date, title, source_url
-- from board_meetings
-- where top_verticals @> '[{"vertical_id":"lightspeed_audio"}]'
--   and meeting_date > current_date - 90
-- order by meeting_date desc;

-- All districts that triggered alerts for Valcom:
-- select distinct district_id, meeting_date, title
-- from board_meetings
-- where customer_alerts @> '[{"customer_id":"valcom"}]'
-- order by meeting_date desc;

-- Count signals by platform:
-- select source_platform, document_type, count(*)
-- from board_meetings
-- group by 1, 2
-- order by 3 desc;
