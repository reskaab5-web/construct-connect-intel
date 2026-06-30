-- ============================================================
-- signals table v2: intent-aware columns
-- Run this migration after schema_intents.sql
-- ============================================================

-- Add intent tracking to signals
ALTER TABLE signals
  ADD COLUMN IF NOT EXISTS intent_id    UUID REFERENCES signal_intents(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS keyword_ids  UUID[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS org_id       UUID REFERENCES organizations(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_signals_intent ON signals(intent_id);
CREATE INDEX IF NOT EXISTS idx_signals_org    ON signals(org_id);

-- ── Helper function: increment keyword match counts ──────────────────────
-- Called by keyword_loader.py after each document is processed.
CREATE OR REPLACE FUNCTION increment_keyword_match_counts(
  p_keyword_ids UUID[],
  p_matched_at  TIMESTAMPTZ
) RETURNS VOID AS $$
BEGIN
  UPDATE intent_keywords
  SET match_count     = match_count + 1,
      last_matched_at = p_matched_at,
      updated_at      = NOW()
  WHERE id = ANY(p_keyword_ids);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_keyword_match_counts TO service_role;

-- ── View: signals enriched with intent data ──────────────────────────────
-- Replaces the bare signals query in the dashboard and API.
CREATE OR REPLACE VIEW v_signals_enriched AS
SELECT
  s.*,
  si.name       AS intent_name,
  si.icon       AS intent_icon,
  si.color      AS intent_color,
  si.weight     AS intent_priority,
  d.name        AS district_name,
  d.state       AS district_state,
  d.enrollment  AS district_enrollment
FROM signals s
LEFT JOIN signal_intents si ON si.id = s.intent_id
LEFT JOIN districts      d  ON d.id  = s.district_id
ORDER BY s.created_at DESC;

-- ── Update opportunity score function to weight intents ──────────────────
-- Replaces the original recalculate_opportunity_score() to add intent weight
-- as a multiplier on recent signals.
CREATE OR REPLACE FUNCTION recalculate_opportunity_score()
RETURNS TRIGGER AS $$
DECLARE
  v_district_id   UUID;
  v_score         INTEGER := 0;
  v_signal_score  INTEGER;
  v_recent        INTEGER;
  v_bond_score    INTEGER;
  v_leadership    INTEGER;
  v_lcap_score    INTEGER;
BEGIN
  -- Determine district_id from whichever table triggered this
  v_district_id := COALESCE(NEW.district_id, OLD.district_id);

  -- Signal strength: sum of (signal_strength × intent_priority/10), capped at 40
  SELECT LEAST(40, COALESCE(
    SUM(s.signal_strength * COALESCE(si.weight, 5) / 10.0), 0
  )::INTEGER)
  INTO v_signal_score
  FROM signals s
  LEFT JOIN signal_intents si ON si.id = s.intent_id
  WHERE s.district_id = v_district_id;

  -- Recency bonus: signals in last 30 days, capped at 20
  SELECT LEAST(20, COUNT(*) * 4)
  INTO v_recent
  FROM signals
  WHERE district_id = v_district_id
    AND created_at >= NOW() - INTERVAL '30 days';

  -- Active bond measures, capped at 20
  SELECT LEAST(20, COUNT(*) * 10)
  INTO v_bond_score
  FROM bond_measures
  WHERE district_id = v_district_id AND is_active = TRUE;

  -- Leadership changes in last 6 months, capped at 20
  SELECT LEAST(20, COUNT(*) * 10)
  INTO v_leadership
  FROM leadership_changes
  WHERE district_id = v_district_id
    AND detected_at >= NOW() - INTERVAL '6 months';

  -- LCAP mentions, capped at 10
  SELECT LEAST(10, COUNT(*) * 5)
  INTO v_lcap_score
  FROM lcap_filings
  WHERE district_id = v_district_id AND signal_strength >= 5;

  v_score := v_signal_score + v_recent + v_bond_score + v_leadership + v_lcap_score;

  UPDATE districts
  SET opportunity_score = LEAST(100, v_score),
      updated_at        = NOW()
  WHERE id = v_district_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
