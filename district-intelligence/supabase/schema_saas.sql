-- ============================================================
-- District Intelligence Platform — SaaS Multi-Tenant Layer
-- Run AFTER schema.sql
-- ============================================================

-- ============================================================
-- ORGANIZATIONS (vendor accounts)
-- ============================================================
CREATE TABLE IF NOT EXISTS organizations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,        -- e.g. "lightspeed", "nureva"
  vertical        TEXT NOT NULL CHECK (vertical IN (
                    'instructional_audio',
                    'edtech_devices',
                    'safety_security',
                    'construction_facilities',
                    'multi_vertical'           -- enterprise tier
                  )),
  logo_url        TEXT,
  primary_color   TEXT DEFAULT '#6366f1',      -- for white-label dashboard
  domain          TEXT,                        -- verified domain for SSO
  plan            TEXT NOT NULL DEFAULT 'trial' CHECK (plan IN (
                    'trial',     -- 14 days, 20 districts, no API
                    'starter',   -- $299/mo, 100 districts, 1 state
                    'growth',    -- $799/mo, 500 districts, 5 states
                    'enterprise' -- $2499/mo, unlimited, API + webhooks
                  )),
  plan_started_at TIMESTAMPTZ DEFAULT NOW(),
  plan_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  api_key         TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  webhook_url     TEXT,                        -- CRM push destination
  webhook_secret  TEXT DEFAULT encode(gen_random_bytes(16), 'hex'),
  territory_states TEXT[],                    -- e.g. ['CA', 'TX', 'FL']
  territory_min_enrollment INTEGER DEFAULT 0, -- filter small districts
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_org_slug ON organizations(slug);
CREATE INDEX idx_org_api_key ON organizations(api_key);
CREATE INDEX idx_org_vertical ON organizations(vertical);

-- ============================================================
-- ORG MEMBERS (users within a vendor account)
-- ============================================================
CREATE TABLE IF NOT EXISTS org_members (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  role            TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invited_at      TIMESTAMPTZ DEFAULT NOW(),
  accepted_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_org_members_unique ON org_members(org_id, email);
CREATE INDEX idx_org_members_user ON org_members(user_id);

-- ============================================================
-- VENDOR SIGNAL CONFIGS
-- Per-org keyword sets and scoring weights by vertical
-- ============================================================
CREATE TABLE IF NOT EXISTS vendor_signal_configs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,
  -- Custom keyword overrides (merged with vertical defaults)
  custom_keywords TEXT[] DEFAULT '{}',
  excluded_keywords TEXT[] DEFAULT '{}',
  -- Scoring weight multipliers (1.0 = default, 2.0 = double weight)
  weight_bond_measure    NUMERIC(3,1) DEFAULT 1.0,
  weight_lcap            NUMERIC(3,1) DEFAULT 1.0,
  weight_leadership      NUMERIC(3,1) DEFAULT 1.0,
  weight_board_meeting   NUMERIC(3,1) DEFAULT 1.0,
  -- Minimum signal strength to surface (filter noise)
  min_signal_strength    INTEGER DEFAULT 3,
  -- Alert thresholds
  alert_on_score_above   INTEGER DEFAULT 60,   -- trigger webhook when score crosses this
  alert_on_bond_passed   BOOLEAN DEFAULT TRUE,
  alert_on_leadership_change BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VERTICAL KEYWORD LIBRARIES
-- Canonical keyword sets per vertical — used by collectors
-- ============================================================
CREATE TABLE IF NOT EXISTS vertical_keywords (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vertical        TEXT NOT NULL,
  keyword         TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category IN (
                    'product_direct',    -- names the product type
                    'problem_signal',    -- indicates pain point
                    'budget_signal',     -- indicates money available
                    'competitor',        -- competitor brand mention
                    'project_type'       -- renovation/construction type
                  )),
  base_weight     INTEGER DEFAULT 1 CHECK (base_weight BETWEEN 1 AND 5),
                  -- 5 = explicit purchase intent, 1 = weak mention
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_vk_unique ON vertical_keywords(vertical, keyword);
CREATE INDEX idx_vk_vertical ON vertical_keywords(vertical);

-- ============================================================
-- ORG-DISTRICT ASSIGNMENTS
-- Which districts each org is tracking / has claimed
-- ============================================================
CREATE TABLE IF NOT EXISTS org_districts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  district_id     UUID NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  opportunity_score_override INTEGER,          -- org can manually override score
  tier_override   TEXT CHECK (tier_override IN ('hot','warm','cold','watch')),
  assigned_rep    TEXT,                        -- sales rep name for this district
  crm_record_id   TEXT,                       -- their CRM's ID for this account
  tags            TEXT[] DEFAULT '{}',
  notes           TEXT,
  is_claimed      BOOLEAN DEFAULT FALSE,       -- marked as "we're working this"
  claimed_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, district_id)
);

CREATE INDEX idx_od_org ON org_districts(org_id);
CREATE INDEX idx_od_district ON org_districts(district_id);

-- ============================================================
-- ORG SIGNAL SUBSCRIPTIONS
-- Which signals each org sees (filtered view)
-- ============================================================
CREATE OR REPLACE VIEW v_org_signals AS
SELECT
  s.id,
  s.district_id,
  s.org_id,
  s.source_type,
  s.source_url,
  s.source_date,
  s.title,
  s.summary,
  s.raw_content,
  s.keywords_matched,
  s.signal_strength,
  s.opportunity_type,
  s.is_actionable,
  s.created_at,
  d.name        AS district_name,
  d.state       AS district_state,
  d.enrollment  AS district_enrollment,
  od.assigned_rep,
  od.is_claimed
FROM signals s
JOIN districts d ON d.id = s.district_id
JOIN org_districts od ON od.district_id = s.district_id
  AND od.org_id = s.org_id;

-- ============================================================
-- WEBHOOK DELIVERY LOG
-- Track every CRM push attempt
-- ============================================================
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id          UUID NOT NULL REFERENCES organizations(id),
  signal_id       UUID REFERENCES signals(id),
  district_id     UUID REFERENCES districts(id),
  event_type      TEXT NOT NULL,              -- 'new_signal', 'score_change', 'tier_change'
  payload         JSONB,
  delivered_at    TIMESTAMPTZ,
  response_status INTEGER,
  response_body   TEXT,
  retry_count     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wh_org ON webhook_deliveries(org_id);
CREATE INDEX idx_wh_created ON webhook_deliveries(created_at DESC);

-- ============================================================
-- USAGE METRICS (for billing)
-- ============================================================
CREATE TABLE IF NOT EXISTS usage_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id          UUID NOT NULL REFERENCES organizations(id),
  event_type      TEXT NOT NULL,              -- 'api_call', 'signal_viewed', 'export', 'webhook_sent'
  metadata        JSONB,
  recorded_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_usage_org_month ON usage_events(org_id, recorded_at);

-- ============================================================
-- PLAN LIMITS VIEW
-- ============================================================
CREATE OR REPLACE VIEW v_plan_limits AS
SELECT
  o.id,
  o.name,
  o.plan,
  o.territory_states,
  COUNT(DISTINCT od.district_id) AS district_count,
  CASE o.plan
    WHEN 'trial'      THEN 20
    WHEN 'starter'    THEN 100
    WHEN 'growth'     THEN 500
    WHEN 'enterprise' THEN 999999
  END AS district_limit,
  CASE o.plan
    WHEN 'trial'      THEN FALSE
    WHEN 'starter'    THEN FALSE
    WHEN 'growth'     THEN TRUE
    WHEN 'enterprise' THEN TRUE
  END AS api_access,
  CASE o.plan
    WHEN 'trial'      THEN FALSE
    WHEN 'starter'    THEN FALSE
    WHEN 'growth'     THEN FALSE
    WHEN 'enterprise' THEN TRUE
  END AS webhook_access
FROM organizations o
LEFT JOIN org_districts od ON od.org_id = o.id
GROUP BY o.id;

-- ============================================================
-- RLS for multi-tenancy
-- Users only see their org's data
-- ============================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_signal_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;

-- Service role: full access
CREATE POLICY "service_full" ON organizations FOR ALL USING (auth.role()='service_role');
CREATE POLICY "service_full" ON org_members FOR ALL USING (auth.role()='service_role');
CREATE POLICY "service_full" ON org_districts FOR ALL USING (auth.role()='service_role');
CREATE POLICY "service_full" ON vendor_signal_configs FOR ALL USING (auth.role()='service_role');
CREATE POLICY "service_full" ON webhook_deliveries FOR ALL USING (auth.role()='service_role');
CREATE POLICY "service_full" ON usage_events FOR ALL USING (auth.role()='service_role');

-- Members see only their org
CREATE POLICY "member_own_org" ON organizations FOR SELECT
  USING (id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid()));

CREATE POLICY "member_own_org" ON org_districts FOR SELECT
  USING (org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid()));

CREATE POLICY "member_own_org" ON vendor_signal_configs FOR SELECT
  USING (org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid()));
