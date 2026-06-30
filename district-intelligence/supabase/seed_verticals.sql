-- ============================================================
-- Vertical Keyword Libraries — Seed Data
-- 4 verticals: instructional_audio, edtech_devices,
--              safety_security, construction_facilities
-- ============================================================

-- ── INSTRUCTIONAL AUDIO ──────────────────────────────────────

INSERT INTO vertical_keywords (vertical, keyword, category, base_weight) VALUES
-- Product direct (weight 4-5)
('instructional_audio', 'classroom audio', 'product_direct', 5),
('instructional_audio', 'instructional audio', 'product_direct', 5),
('instructional_audio', 'sound field system', 'product_direct', 5),
('instructional_audio', 'hearing loop', 'product_direct', 5),
('instructional_audio', 'induction loop', 'product_direct', 5),
('instructional_audio', 'fm system', 'product_direct', 4),
('instructional_audio', 'audio enhancement', 'product_direct', 4),
('instructional_audio', 'voice amplification', 'product_direct', 4),
('instructional_audio', 'pa system', 'product_direct', 4),
('instructional_audio', 'intercom system', 'product_direct', 4),
('instructional_audio', 'paging system', 'product_direct', 4),
('instructional_audio', 'speaker system', 'product_direct', 3),
('instructional_audio', 'microphone', 'product_direct', 3),
('instructional_audio', 'sound system', 'product_direct', 3),
('instructional_audio', 'audio system', 'product_direct', 3),
-- Problem signals (weight 3-4)
('instructional_audio', 'can''t hear the teacher', 'problem_signal', 4),
('instructional_audio', 'hard to hear', 'problem_signal', 4),
('instructional_audio', 'poor acoustics', 'problem_signal', 4),
('instructional_audio', 'hearing impaired students', 'problem_signal', 4),
('instructional_audio', 'noise issues', 'problem_signal', 3),
('instructional_audio', 'teacher voice fatigue', 'problem_signal', 3),
('instructional_audio', 'acoustic problems', 'problem_signal', 3),
('instructional_audio', 'deaf and hard of hearing', 'problem_signal', 4),
('instructional_audio', 'ell students', 'problem_signal', 3),
-- Budget signals (weight 4-5)
('instructional_audio', 'audio equipment budget', 'budget_signal', 5),
('instructional_audio', 'communication systems', 'budget_signal', 4),
('instructional_audio', 'classroom technology upgrade', 'budget_signal', 4),
('instructional_audio', 'assistive technology', 'budget_signal', 3),
('instructional_audio', 'special education technology', 'budget_signal', 3),
-- Competitor mentions (weight 4)
('instructional_audio', 'lightspeed', 'competitor', 5),
('instructional_audio', 'nureva', 'competitor', 4),
('instructional_audio', 'jlab', 'competitor', 4),
('instructional_audio', 'frontrow', 'competitor', 4),
('instructional_audio', 'audio enhancement system', 'competitor', 3),
('instructional_audio', 'phonak roger', 'competitor', 3),
-- Project types (weight 3)
('instructional_audio', 'classroom renovation', 'project_type', 3),
('instructional_audio', 'facility modernization', 'project_type', 3),
('instructional_audio', 'new school construction', 'project_type', 3),
('instructional_audio', 'bond funded technology', 'project_type', 4),
('instructional_audio', 'title i technology', 'project_type', 3),
('instructional_audio', 'e-rate', 'project_type', 3)

ON CONFLICT (vertical, keyword) DO NOTHING;


-- ── EDTECH / DEVICES ─────────────────────────────────────────

INSERT INTO vertical_keywords (vertical, keyword, category, base_weight) VALUES
('edtech_devices', '1:1 initiative', 'product_direct', 5),
('edtech_devices', 'one to one', 'product_direct', 5),
('edtech_devices', 'chromebook', 'product_direct', 4),
('edtech_devices', 'ipad deployment', 'product_direct', 4),
('edtech_devices', 'tablet program', 'product_direct', 4),
('edtech_devices', 'device refresh', 'product_direct', 5),
('edtech_devices', 'student devices', 'product_direct', 4),
('edtech_devices', 'technology refresh', 'budget_signal', 5),
('edtech_devices', 'ed tech budget', 'budget_signal', 5),
('edtech_devices', 'instructional technology', 'budget_signal', 4),
('edtech_devices', 'digital learning', 'budget_signal', 3),
('edtech_devices', 'esser funds', 'budget_signal', 5),
('edtech_devices', 'e-rate funding', 'budget_signal', 4),
('edtech_devices', 'title iv technology', 'budget_signal', 4),
('edtech_devices', 'lcap technology goal', 'budget_signal', 4),
('edtech_devices', 'aging devices', 'problem_signal', 4),
('edtech_devices', 'outdated technology', 'problem_signal', 4),
('edtech_devices', 'slow computers', 'problem_signal', 3),
('edtech_devices', 'device shortage', 'problem_signal', 4),
('edtech_devices', 'remote learning', 'project_type', 3),
('edtech_devices', 'hybrid learning', 'project_type', 3),
('edtech_devices', 'digital equity', 'project_type', 3)

ON CONFLICT (vertical, keyword) DO NOTHING;


-- ── SAFETY & SECURITY ────────────────────────────────────────

INSERT INTO vertical_keywords (vertical, keyword, category, base_weight) VALUES
('safety_security', 'school safety', 'product_direct', 5),
('safety_security', 'security cameras', 'product_direct', 5),
('safety_security', 'camera system', 'product_direct', 5),
('safety_security', 'access control', 'product_direct', 5),
('safety_security', 'door security', 'product_direct', 4),
('safety_security', 'intercom', 'product_direct', 4),
('safety_security', 'visitor management', 'product_direct', 4),
('safety_security', 'emergency notification', 'product_direct', 5),
('safety_security', 'mass notification', 'product_direct', 5),
('safety_security', 'alert system', 'product_direct', 4),
('safety_security', 'panic button', 'product_direct', 5),
('safety_security', 'lockdown system', 'product_direct', 5),
('safety_security', 'rave alert', 'competitor', 4),
('safety_security', 'singlewire', 'competitor', 4),
('safety_security', 'raptor', 'competitor', 4),
('safety_security', 'verkada', 'competitor', 4),
('safety_security', 'avigilon', 'competitor', 3),
('safety_security', 'school shooting', 'problem_signal', 5),
('safety_security', 'security incident', 'problem_signal', 5),
('safety_security', 'unsafe campus', 'problem_signal', 4),
('safety_security', 'threat assessment', 'problem_signal', 4),
('safety_security', 'safe schools act', 'budget_signal', 5),
('safety_security', 'school safety grant', 'budget_signal', 5),
('safety_security', 'stop act', 'budget_signal', 4),
('safety_security', 'security bond measure', 'budget_signal', 5),
('safety_security', 'safety upgrade', 'project_type', 4),
('safety_security', 'campus security project', 'project_type', 4)

ON CONFLICT (vertical, keyword) DO NOTHING;


-- ── CONSTRUCTION & FACILITIES ─────────────────────────────────

INSERT INTO vertical_keywords (vertical, keyword, category, base_weight) VALUES
('construction_facilities', 'new school construction', 'product_direct', 5),
('construction_facilities', 'school renovation', 'product_direct', 5),
('construction_facilities', 'modernization project', 'product_direct', 5),
('construction_facilities', 'facility upgrade', 'product_direct', 4),
('construction_facilities', 'capital improvement', 'product_direct', 4),
('construction_facilities', 'deferred maintenance', 'product_direct', 4),
('construction_facilities', 'hvac replacement', 'product_direct', 3),
('construction_facilities', 'roofing project', 'product_direct', 3),
('construction_facilities', 'bond measure', 'budget_signal', 5),
('construction_facilities', 'measure passed', 'budget_signal', 5),
('construction_facilities', 'bond election', 'budget_signal', 5),
('construction_facilities', 'construction bond', 'budget_signal', 5),
('construction_facilities', 'facilities master plan', 'budget_signal', 4),
('construction_facilities', 'capital outlay', 'budget_signal', 4),
('construction_facilities', 'construction bid', 'budget_signal', 5),
('construction_facilities', 'rfp construction', 'budget_signal', 5),
('construction_facilities', 'architect selection', 'budget_signal', 4),
('construction_facilities', 'aging facilities', 'problem_signal', 4),
('construction_facilities', 'portable classrooms', 'problem_signal', 3),
('construction_facilities', 'overcrowding', 'problem_signal', 3),
('construction_facilities', 'facilities assessment', 'project_type', 4),
('construction_facilities', 'dsa approval', 'project_type', 4),
('construction_facilities', 'division of state architect', 'project_type', 3),
('construction_facilities', 'lease-leaseback', 'project_type', 4),
('construction_facilities', 'design build', 'project_type', 4),
('construction_facilities', 'construction manager', 'project_type', 4)

ON CONFLICT (vertical, keyword) DO NOTHING;


-- ── SEED SAMPLE ORGANIZATIONS ────────────────────────────────

INSERT INTO organizations (name, slug, vertical, plan, territory_states) VALUES
('Lightspeed Technologies', 'lightspeed', 'instructional_audio', 'trial', ARRAY['CA', 'TX', 'FL', 'IL', 'NY']),
('Nureva Inc', 'nureva', 'instructional_audio', 'trial', ARRAY['CA', 'WA', 'OR']),
('CDW-G', 'cdwg', 'edtech_devices', 'trial', ARRAY['CA', 'TX', 'IL']),
('Motorola Solutions', 'motorola-solutions', 'safety_security', 'trial', ARRAY['CA', 'TX', 'FL'])
ON CONFLICT (slug) DO NOTHING;

-- Create default signal configs for sample orgs
INSERT INTO vendor_signal_configs (org_id)
SELECT id FROM organizations WHERE slug IN ('lightspeed','nureva','cdwg','motorola-solutions')
ON CONFLICT (org_id) DO NOTHING;
