-- ============================================================
-- Intent-Based Signal Configuration
-- Replaces the flat keyword library with a structured
-- intent → keywords hierarchy.
--
-- The mental model:
--   INTENT = a buying trigger ("District has active construction budget")
--   KEYWORD = a signal that indicates the intent ("bond passed", "measure approved")
--   FEEDBACK = rep says "this was useful" or "this was noise"
-- ============================================================

-- ============================================================
-- SIGNAL INTENTS
-- Each org defines the buying triggers they care about.
-- We ship defaults per vertical; orgs edit/add/remove freely.
-- ============================================================
CREATE TABLE IF NOT EXISTS signal_intents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,            -- e.g. "District has active construction budget"
  description     TEXT,                     -- internal note: why this matters to us
  color           TEXT DEFAULT '#6366f1',   -- UI color for this intent
  icon            TEXT DEFAULT '🎯',        -- emoji icon
  weight          INTEGER DEFAULT 5 CHECK (weight BETWEEN 1 AND 10),
                  -- how much does THIS intent matter vs others (1=low, 10=critical)
  is_active       BOOLEAN DEFAULT TRUE,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, name)
);

CREATE INDEX idx_intents_org ON signal_intents(org_id);

-- ============================================================
-- INTENT KEYWORDS
-- The keywords / phrases that indicate each intent.
-- Orgs add, remove, and reweight these over time.
-- ============================================================
CREATE TABLE IF NOT EXISTS intent_keywords (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  intent_id       UUID NOT NULL REFERENCES signal_intents(id) ON DELETE CASCADE,
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  keyword         TEXT NOT NULL,
  -- Scoring
  match_weight    INTEGER DEFAULT 3 CHECK (match_weight BETWEEN 1 AND 10),
                  -- 10 = "bond passed" (near-certain buying signal)
                  -- 1  = "technology" (vague mention)
  require_context TEXT,                     -- optional: keyword only counts if THIS word is nearby
                                            -- e.g. "audio" only counts if "classroom" is within 50 chars
  -- Source targeting
  applies_to_youtube   BOOLEAN DEFAULT TRUE,
  applies_to_lcap      BOOLEAN DEFAULT TRUE,
  applies_to_bonds     BOOLEAN DEFAULT TRUE,
  applies_to_news      BOOLEAN DEFAULT TRUE,
  -- Performance tracking
  match_count     INTEGER DEFAULT 0,        -- how many times this keyword has fired
  useful_count    INTEGER DEFAULT 0,        -- how many times reps marked the signal useful
  noise_count     INTEGER DEFAULT 0,        -- how many times reps marked it noise
  last_matched_at TIMESTAMPTZ,
  -- Metadata
  added_by        TEXT,                     -- 'system' or rep name
  note            TEXT,                     -- why this keyword was added
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(intent_id, keyword)
);

CREATE INDEX idx_ik_intent ON intent_keywords(intent_id);
CREATE INDEX idx_ik_org ON intent_keywords(org_id);
CREATE INDEX idx_ik_keyword ON intent_keywords(keyword);

-- ============================================================
-- SIGNAL FEEDBACK
-- Reps rate signals: useful or noise.
-- This feeds back into keyword performance stats.
-- ============================================================
CREATE TABLE IF NOT EXISTS signal_feedback (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  signal_id       UUID NOT NULL REFERENCES signals(id) ON DELETE CASCADE,
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  intent_id       UUID REFERENCES signal_intents(id),
  keyword_id      UUID REFERENCES intent_keywords(id),
  rating          TEXT NOT NULL CHECK (rating IN ('useful', 'noise', 'great_lead')),
  rep_name        TEXT,
  note            TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feedback_signal ON signal_feedback(signal_id);
CREATE INDEX idx_feedback_org ON signal_feedback(org_id);
CREATE INDEX idx_feedback_keyword ON signal_feedback(keyword_id);

-- ============================================================
-- FUNCTION: update keyword stats when feedback is submitted
-- ============================================================
CREATE OR REPLACE FUNCTION update_keyword_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.keyword_id IS NOT NULL THEN
    UPDATE intent_keywords SET
      useful_count = useful_count + CASE WHEN NEW.rating IN ('useful','great_lead') THEN 1 ELSE 0 END,
      noise_count  = noise_count  + CASE WHEN NEW.rating = 'noise' THEN 1 ELSE 0 END,
      updated_at   = NOW()
    WHERE id = NEW.keyword_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_keyword_feedback
AFTER INSERT ON signal_feedback
FOR EACH ROW EXECUTE FUNCTION update_keyword_stats();

-- ============================================================
-- VIEW: keyword performance summary
-- Shows which keywords are driving useful vs noisy signals
-- ============================================================
CREATE OR REPLACE VIEW v_keyword_performance AS
SELECT
  ik.id,
  ik.org_id,
  si.name AS intent_name,
  si.color AS intent_color,
  ik.keyword,
  ik.match_weight,
  ik.match_count,
  ik.useful_count,
  ik.noise_count,
  ik.last_matched_at,
  ik.is_active,
  CASE
    WHEN ik.match_count = 0 THEN NULL
    ELSE ROUND(ik.useful_count::numeric / ik.match_count * 100, 1)
  END AS useful_rate_pct,
  CASE
    WHEN (ik.useful_count + ik.noise_count) = 0 THEN 'untested'
    WHEN ik.useful_count::numeric / NULLIF(ik.useful_count + ik.noise_count, 0) >= 0.7 THEN 'high_signal'
    WHEN ik.useful_count::numeric / NULLIF(ik.useful_count + ik.noise_count, 0) >= 0.4 THEN 'moderate'
    ELSE 'noisy'
  END AS performance_label,
  ik.note,
  ik.added_by
FROM intent_keywords ik
JOIN signal_intents si ON si.id = ik.intent_id
WHERE ik.is_active = TRUE
ORDER BY si.sort_order, ik.match_weight DESC;

-- ============================================================
-- DEFAULT INTENTS + KEYWORDS for "instructional_audio" vertical
-- Ships when a new org is onboarded with this vertical.
-- Orgs can edit all of this.
-- ============================================================
-- (Called from application code during onboarding, parameterized by org_id)
-- Example structure shown here as comments for documentation:
--
-- Intent: "District has active capital budget for AV/tech"
--   Keywords: "bond passed" (10), "bond approved" (10), "measure approved" (9),
--             "lcap technology allocation" (8), "capital improvement" (7),
--             "technology budget" (7), "e-rate funding" (6)
--
-- Intent: "Someone is complaining about current audio"
--   Keywords: "can't hear" (9), "hearing problem" (9), "poor audio" (8),
--             "students can't hear" (9), "teacher voice" (7), "acoustics" (6)
--
-- Intent: "New decision-maker in the seat"
--   Keywords: "new superintendent" (8), "superintendent named" (8),
--             "new CTO" (8), "technology director" (7), "new principal" (5)
--
-- Intent: "Facility project that will touch classrooms"
--   Keywords: "classroom renovation" (7), "new school construction" (8),
--             "modernization project" (7), "remodel" (6), "facility upgrade" (6)
--
-- Intent: "Regulatory or compliance pressure"
--   Keywords: "ADA compliance" (8), "504 plan" (7), "hearing impaired" (7),
--             "IDEA compliance" (7), "assistive technology requirement" (8)
-- ============================================================

-- RLS
ALTER TABLE signal_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE intent_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_own" ON signal_intents FOR ALL
  USING (org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid()));
CREATE POLICY "org_own" ON intent_keywords FOR ALL
  USING (org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid()));
CREATE POLICY "org_own" ON signal_feedback FOR ALL
  USING (org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid()));

CREATE POLICY "service_full" ON signal_intents FOR ALL USING (auth.role()='service_role');
CREATE POLICY "service_full" ON intent_keywords FOR ALL USING (auth.role()='service_role');
CREATE POLICY "service_full" ON signal_feedback FOR ALL USING (auth.role()='service_role');
