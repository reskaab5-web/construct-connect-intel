-- ============================================================
-- Contact enrichment schema
-- Run this in Supabase SQL editor before using linkedin_enricher.py
-- ============================================================

-- ── 1. Add enrichment columns to leadership_changes ────────────────────────
alter table leadership_changes
  add column if not exists email        text,
  add column if not exists phone        text,
  add column if not exists linkedin_url text,
  add column if not exists enriched_at  timestamptz;

-- ── 2. district_contacts table ─────────────────────────────────────────────
-- Full contact card per person per district.
-- One row per unique (district_id, email).
-- Populated by linkedin_enricher.py via Apollo.io.

create table if not exists district_contacts (
  id            uuid default gen_random_uuid() primary key,
  district_id   uuid references districts(id) on delete cascade,
  org_id        uuid not null,

  -- Identity
  first_name    text,
  last_name     text,
  full_name     text,
  title         text,          -- verified job title from Apollo

  -- Contact channels
  email         text,
  phone         text,
  linkedin_url  text,

  -- Metadata
  apollo_id     text unique,   -- Apollo person ID (dedup key)
  city          text,
  state         text,
  source        text default 'apollo',
  enriched_at   timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Unique constraint: one record per district + email
create unique index if not exists idx_district_contacts_district_email
  on district_contacts(district_id, email)
  where email is not null;

create index if not exists idx_district_contacts_district  on district_contacts(district_id);
create index if not exists idx_district_contacts_org       on district_contacts(org_id);
create index if not exists idx_district_contacts_name      on district_contacts(full_name);
create index if not exists idx_district_contacts_linkedin  on district_contacts(linkedin_url);

-- ── 3. Useful queries ───────────────────────────────────────────────────────

-- All enriched contacts for a district:
-- select full_name, title, email, phone, linkedin_url
-- from district_contacts
-- where district_id = '...'
-- order by title;

-- Superintendents with email + LinkedIn:
-- select dc.full_name, dc.email, dc.linkedin_url, d.name as district
-- from district_contacts dc
-- join districts d on d.id = dc.district_id
-- where dc.title ilike '%superintendent%'
--   and dc.email is not null
--   and dc.linkedin_url is not null
-- order by d.name;

-- Unenriched leadership changes (NULL email):
-- select lc.person_name, lc.role, d.name
-- from leadership_changes lc
-- join districts d on d.id = lc.district_id
-- where lc.email is null
--   and lc.person_name is not null
--   and lc.person_name != 'Unknown'
-- order by lc.effective_date desc;

-- Coverage rate:
-- select
--   count(*) filter (where email is not null)     as with_email,
--   count(*) filter (where linkedin_url is not null) as with_linkedin,
--   count(*) filter (where phone is not null)     as with_phone,
--   count(*)                                       as total
-- from leadership_changes
-- where person_name is not null and person_name != 'Unknown';
