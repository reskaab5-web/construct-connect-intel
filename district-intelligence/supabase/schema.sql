-- ============================================================
-- District Intelligence Platform — Supabase Schema
-- ConstructConnect / Instructional Audio Sales Intelligence
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for fuzzy text search

-- ============================================================
-- DISTRICTS
-- Core record for each monitored school district
-- ============================================================
CREATE TABLE IF NOT EXISTS districts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nces_id         TEXT UNIQUE,              -- National Center for Ed Stats district ID
  name            TEXT NOT NULL,
  state           TEXT NOT NULL,
  county          TEXT,
  city            TEXT,
  enrollment      INTEGER,
  school_count    INTEGER,
  website         TEXT,
  youtube_channel TEXT,                     -- district or board YouTube channel URL
  board_meeting_search_query TEXT,          -- custom YouTube search string for this district
  superintendent  TEXT,
  superintendent_email TEXT,
  cto_name        TEXT,
  cto_email       TEXT,
  facilities_director TEXT,
  facilities_email TEXT,
  opportunity_score INTEGER DEFAULT 0 CHECK (opportunity_score BETWEEN 0 AND 100),
  tier            TEXT CHECK (tier IN ('hot', 'warm', 'cold', 'watch')) DEFAULT 'watch',
  status          TEXT CHECK (status IN ('prospect', 'contacted', 'active', 'closed_won', 'closed_lost')) DEFAULT 'prospect',
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_districts_state ON districts(state);
CREATE INDEX idx_districts_tier ON districts(tier);
CREATE INDEX idx_districts_opportunity_score ON districts(opportunity_score DESC);
CREATE INDEX idx_districts_name_trgm ON districts USING GIN (name gin_trgm_ops);

-- ============================================================
-- SIGNALS
-- Every intelligence event captured from any source
-- ============================================================
CREATE TABLE IF NOT EXISTS signals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  district_id     UUID NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  source_type     TEXT NOT NULL CHECK (source_type IN (
                    'youtube_board_meeting',
                    'lcap_filing',
                    'bond_measure',
                    'leadership_change',
                    'news_mention',
                    'manual'
                  )),
  source_url      TEXT,
  source_date     DATE,
  title           TEXT,
  summary         TEXT,                     -- AI-generated summary
  raw_content     TEXT,                     -- transcript excerpt or raw text
  keywords_matched TEXT[],                  -- e.g. ['audio', 'sound system', 'microphone', 'pa system']
  sentiment       TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  signal_strength INTEGER DEFAULT 1 CHECK (signal_strength BETWEEN 1 AND 10),
  -- 1=weak mention, 10=explicit budget allocation for audio
  opportunity_type TEXT CHECK (opportunity_type IN (
                    'budget_discussion',
                    'facility_renovation',
                    'bond_funded_project',
                    'complaint_audio_quality',
                    'leadership_transition',
                    'technology_refresh',
                    'new_construction',
                    'lcap_technology_goal',
                    'other'
                  )),
  is_actionable   BOOLEAN DEFAULT FALSE,
  actioned_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_signals_district_id ON signals(district_id);
CREATE INDEX idx_signals_source_type ON signals(source_type);
CREATE INDEX idx_signals_source_date ON signals(source_date DESC);
CREATE INDEX idx_signals_signal_strength ON signals(signal_strength DESC);
CREATE INDEX idx_signals_is_actionable ON signals(is_actionable) WHERE is_actionable = TRUE;

-- ============================================================
-- BOND MEASURES
-- Detailed tracking of bond elections and project scopes
-- ============================================================
CREATE TABLE IF NOT EXISTS bond_measures (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  district_id     UUID NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  measure_name    TEXT,                     -- e.g. "Measure J"
  election_date   DATE,
  amount          BIGINT,                   -- total bond amount in dollars
  passed          BOOLEAN,
  vote_percentage NUMERIC(5,2),
  project_scope   TEXT,                     -- full scope description
  technology_included BOOLEAN DEFAULT FALSE,
  audio_visual_mentioned BOOLEAN DEFAULT FALSE,
  av_budget_estimate BIGINT,               -- estimated AV portion if extractable
  construction_start DATE,
  construction_end DATE,
  source_url      TEXT,
  raw_text        TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bond_measures_district_id ON bond_measures(district_id);
CREATE INDEX idx_bond_measures_election_date ON bond_measures(election_date DESC);
CREATE INDEX idx_bond_measures_passed ON bond_measures(passed) WHERE passed = TRUE;
CREATE INDEX idx_bond_measures_av ON bond_measures(audio_visual_mentioned) WHERE audio_visual_mentioned = TRUE;

-- ============================================================
-- LCAP FILINGS
-- Local Control Accountability Plan technology goals and budgets
-- ============================================================
CREATE TABLE IF NOT EXISTS lcap_filings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  district_id     UUID NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  fiscal_year     TEXT NOT NULL,            -- e.g. "2024-25"
  filing_date     DATE,
  source_url      TEXT,
  technology_goals TEXT[],                  -- extracted tech-related goals
  technology_budget BIGINT,                 -- total tech expenditure planned
  instructional_audio_mentioned BOOLEAN DEFAULT FALSE,
  audio_budget_extract TEXT,               -- raw text around audio mentions
  goal_1_text     TEXT,
  goal_2_text     TEXT,
  goal_3_text     TEXT,
  ai_summary      TEXT,                     -- Claude summary of tech section
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lcap_district_id ON lcap_filings(district_id);
CREATE INDEX idx_lcap_fiscal_year ON lcap_filings(fiscal_year);
CREATE INDEX idx_lcap_audio ON lcap_filings(instructional_audio_mentioned) WHERE instructional_audio_mentioned = TRUE;

-- ============================================================
-- YOUTUBE MONITORING
-- Board meeting video tracking and transcript analysis
-- ============================================================
CREATE TABLE IF NOT EXISTS youtube_videos (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  district_id     UUID NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  video_id        TEXT NOT NULL UNIQUE,     -- YouTube video ID
  title           TEXT,
  published_at    TIMESTAMPTZ,
  duration_seconds INTEGER,
  view_count      INTEGER,
  channel_id      TEXT,
  channel_name    TEXT,
  description     TEXT,
  transcript_fetched BOOLEAN DEFAULT FALSE,
  transcript_text TEXT,                     -- full transcript
  ai_summary      TEXT,                     -- Claude summary
  audio_keywords_found TEXT[],             -- matched keywords
  signal_ids      UUID[],                  -- signals generated from this video
  processed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_youtube_district_id ON youtube_videos(district_id);
CREATE INDEX idx_youtube_published_at ON youtube_videos(published_at DESC);
CREATE INDEX idx_youtube_processed ON youtube_videos(transcript_fetched);

-- ============================================================
-- LEADERSHIP CHANGES
-- Superintendent, CTO, and facilities director tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS leadership_changes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  district_id     UUID NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('superintendent', 'cto', 'facilities_director', 'board_president', 'other')),
  previous_name   TEXT,
  new_name        TEXT,
  effective_date  DATE,
  source_url      TEXT,
  source_type     TEXT,                     -- 'news', 'board_agenda', 'district_website'
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leadership_district_id ON leadership_changes(district_id);
CREATE INDEX idx_leadership_effective_date ON leadership_changes(effective_date DESC);

-- ============================================================
-- OUTREACH LOG
-- Track sales touches per district
-- ============================================================
CREATE TABLE IF NOT EXISTS outreach_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  district_id     UUID NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  contact_name    TEXT,
  contact_role    TEXT,
  contact_email   TEXT,
  outreach_type   TEXT CHECK (outreach_type IN ('email', 'call', 'demo', 'proposal', 'follow_up')),
  outreach_date   DATE DEFAULT CURRENT_DATE,
  outcome         TEXT,
  next_step       TEXT,
  next_step_date  DATE,
  rep_name        TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_outreach_district_id ON outreach_log(district_id);
CREATE INDEX idx_outreach_date ON outreach_log(outreach_date DESC);

-- ============================================================
-- OPPORTUNITY SCORES (materialized view for dashboard)
-- ============================================================
CREATE OR REPLACE VIEW v_district_opportunities AS
SELECT
  d.id,
  d.name,
  d.state,
  d.city,
  d.enrollment,
  d.school_count,
  d.superintendent,
  d.opportunity_score,
  d.tier,
  d.status,
  d.updated_at,
  COUNT(DISTINCT s.id) AS signal_count,
  COUNT(DISTINCT s.id) FILTER (WHERE s.source_date >= CURRENT_DATE - INTERVAL '90 days') AS recent_signal_count,
  MAX(s.signal_strength) AS max_signal_strength,
  COUNT(DISTINCT bm.id) FILTER (WHERE bm.passed = TRUE) AS active_bonds,
  SUM(bm.amount) FILTER (WHERE bm.passed = TRUE) AS total_bond_value,
  COUNT(DISTINCT lf.id) AS lcap_count,
  COUNT(DISTINCT lc.id) FILTER (WHERE lc.effective_date >= CURRENT_DATE - INTERVAL '365 days') AS leadership_changes_1yr,
  (SELECT title FROM signals WHERE district_id = d.id ORDER BY signal_strength DESC, source_date DESC LIMIT 1) AS top_signal_title,
  (SELECT source_date FROM signals WHERE district_id = d.id ORDER BY source_date DESC LIMIT 1) AS last_signal_date
FROM districts d
LEFT JOIN signals s ON s.district_id = d.id
LEFT JOIN bond_measures bm ON bm.district_id = d.id
LEFT JOIN lcap_filings lf ON lf.district_id = d.id
LEFT JOIN leadership_changes lc ON lc.district_id = d.id
GROUP BY d.id;

-- ============================================================
-- AUTO-UPDATE opportunity_score TRIGGER
-- Recalculates score whenever signals change
-- ============================================================
CREATE OR REPLACE FUNCTION recalculate_opportunity_score()
RETURNS TRIGGER AS $$
DECLARE
  v_district_id UUID;
  v_score INTEGER;
BEGIN
  v_district_id := COALESCE(NEW.district_id, OLD.district_id);

  SELECT
    LEAST(100,
      -- Base: sum of signal strengths (capped at 40)
      LEAST(40, COALESCE(SUM(s.signal_strength) * 2, 0))
      -- Recency bonus: signals in last 90 days (up to 20)
      + LEAST(20, COUNT(s.id) FILTER (WHERE s.source_date >= CURRENT_DATE - INTERVAL '90 days') * 5)
      -- Bond passed bonus (up to 20)
      + LEAST(20, COUNT(DISTINCT bm.id) FILTER (WHERE bm.passed AND bm.audio_visual_mentioned) * 10)
      -- Leadership change in last year (10 pts each, up to 20)
      + LEAST(20, COUNT(DISTINCT lc.id) FILTER (WHERE lc.effective_date >= CURRENT_DATE - INTERVAL '365 days') * 10)
      -- LCAP audio mention (10 pts)
      + LEAST(10, COUNT(DISTINCT lf.id) FILTER (WHERE lf.instructional_audio_mentioned) * 10)
    )
  INTO v_score
  FROM districts d
  LEFT JOIN signals s ON s.district_id = d.id
  LEFT JOIN bond_measures bm ON bm.district_id = d.id
  LEFT JOIN lcap_filings lf ON lf.district_id = d.id
  LEFT JOIN leadership_changes lc ON lc.district_id = d.id
  WHERE d.id = v_district_id
  GROUP BY d.id;

  UPDATE districts SET
    opportunity_score = COALESCE(v_score, 0),
    tier = CASE
      WHEN COALESCE(v_score, 0) >= 70 THEN 'hot'
      WHEN COALESCE(v_score, 0) >= 40 THEN 'warm'
      WHEN COALESCE(v_score, 0) >= 20 THEN 'cold'
      ELSE 'watch'
    END,
    updated_at = NOW()
  WHERE id = v_district_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_rescore_on_signal
AFTER INSERT OR UPDATE OR DELETE ON signals
FOR EACH ROW EXECUTE FUNCTION recalculate_opportunity_score();

CREATE TRIGGER trigger_rescore_on_bond
AFTER INSERT OR UPDATE OR DELETE ON bond_measures
FOR EACH ROW EXECUTE FUNCTION recalculate_opportunity_score();

CREATE TRIGGER trigger_rescore_on_lcap
AFTER INSERT OR UPDATE OR DELETE ON lcap_filings
FOR EACH ROW EXECUTE FUNCTION recalculate_opportunity_score();

CREATE TRIGGER trigger_rescore_on_leadership
AFTER INSERT OR UPDATE OR DELETE ON leadership_changes
FOR EACH ROW EXECUTE FUNCTION recalculate_opportunity_score();

-- ============================================================
-- Row Level Security (enable for production)
-- ============================================================
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE bond_measures ENABLE ROW LEVEL SECURITY;
ALTER TABLE lcap_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_log ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (used by your Python collectors)
CREATE POLICY "service_role_all" ON districts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON signals FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON bond_measures FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON lcap_filings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON youtube_videos FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON leadership_changes FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON outreach_log FOR ALL USING (auth.role() = 'service_role');

-- Allow anon read for dashboard (if using anon key in the artifact)
CREATE POLICY "anon_read_districts" ON districts FOR SELECT USING (TRUE);
CREATE POLICY "anon_read_signals" ON signals FOR SELECT USING (TRUE);
CREATE POLICY "anon_read_bonds" ON bond_measures FOR SELECT USING (TRUE);
CREATE POLICY "anon_read_lcap" ON lcap_filings FOR SELECT USING (TRUE);
CREATE POLICY "anon_read_youtube" ON youtube_videos FOR SELECT USING (TRUE);
CREATE POLICY "anon_read_leadership" ON leadership_changes FOR SELECT USING (TRUE);
CREATE POLICY "anon_read_outreach" ON outreach_log FOR SELECT USING (TRUE);
