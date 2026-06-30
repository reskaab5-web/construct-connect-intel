# District Intelligence — Lightspeed Setup Guide

Internal sales intelligence tool for Lightspeed Technologies.
Monitors K-12 districts in California and Nevada across three verticals:
**Instructional Audio · Paging & Intercom · Safety & Security**

---

## Prerequisites

- Python 3.11+
- A Supabase project (free tier works for pilot)
- YouTube Data API v3 key
- Anthropic API key
- SendGrid API key (optional — for digest emails)

---

## One-Time Setup

### 1. Clone and install

```bash
cd district-intelligence
pip install -r requirements.txt
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
YOUTUBE_API_KEY=your-youtube-key
ANTHROPIC_API_KEY=your-anthropic-key
SENDGRID_API_KEY=your-sendgrid-key        # optional
DIGEST_EMAIL=team@lightspeedaudio.com     # who gets the Monday digest
DIGEST_FROM_EMAIL=digest@districtintel.com
```

### 3. Run the Supabase schema migrations

In your Supabase SQL editor, run these files **in order**:

```
supabase/schema.sql              ← core tables (districts, signals, bonds, etc.)
supabase/schema_saas.sql         ← organizations, org_members tables
supabase/schema_intents.sql      ← signal_intents, intent_keywords tables
supabase/schema_signals_v2.sql   ← adds intent_id to signals + helper function
```

### 4. Seed the Lightspeed org

```bash
python seed_lightspeed.py
```

This creates the Lightspeed org, loads all buying triggers and keywords
for the three verticals, and links all CA + NV districts in the territory.

Copy the `ORG_ID` printed at the end into your `.env`:

```env
ORG_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 5. Seed pilot districts

```bash
python collectors/seed_districts.py
```

Loads the 20 pilot districts from `data/pilot_districts.json`.
To add more districts, edit that file or insert directly into Supabase.

---

## Running the Collectors

### Full run (all sources)

```bash
python collectors/run_all.py --days 30
```

Runs YouTube → State Plans → Bonds → Leadership in sequence,
then generates and emails the weekly digest.

### Individual collectors

```bash
# Board meeting transcripts (YouTube)
python collectors/youtube_monitor.py --days 30

# CA LCAP filings + NV ESSA plans
python collectors/state_plan_parser.py --states CA NV

# Bond measures (Ballotpedia + CASH for CA)
python collectors/bond_tracker.py

# Leadership changes (Google News)
python collectors/leadership_monitor.py
```

### Limit to specific districts for testing

```bash
python collectors/run_all.py --district-ids <uuid1> <uuid2> --days 7
```

---

## Weekly Schedule

Set up a cron job to run every Monday morning:

```cron
0 6 * * 1  cd /path/to/district-intelligence && python collectors/run_all.py
```

Or use the built-in scheduler:

```bash
python -c "from collectors.run_all import main; main()" --days 7
```

---

## Dashboard

Open `dashboard/index.html` in a browser.

Enter your Supabase URL and anon key in the sidebar (stored in localStorage).
The dashboard shows:
- **Districts** — scored and tiered by opportunity (Hot ≥70, Warm ≥40, Cold ≥20)
- **Signal Feed** — all signals with source, intent, and strength
- **Analytics** — score distribution, source breakdown, top districts

---

## Signal Configuration

Open `dashboard/settings.html` to customize buying triggers and keywords.

The three Lightspeed verticals are pre-loaded. You can:
- Add keywords to any intent
- Adjust keyword weights (1-10)
- Add a context word requirement to reduce noise
- Mute keywords that are generating false positives

After reps use the system for a few weeks, check **Keyword Performance**
to see which keywords are generating useful signals vs. noise.

---

## Expanding to New States

The system is designed to add states without changing any collector code.

To add a new state (e.g. Texas):

1. Create `states/texas.py` — copy `states/nevada.py` as a starting point
2. Fill in the TEA (Texas Education Agency) URLs and plan type
3. Add to the registry in `states/registry.py`
4. Update `seed_lightspeed.py` — add the new state to `territory_states`
5. Re-run `seed_lightspeed.py --reset` to update the org record

The collectors automatically use the new state config. No other changes needed.

### State-specific notes

| State | Plan Type | Source | Notes |
|-------|-----------|--------|-------|
| **CA** | LCAP | CA Dept of Education | Best data — central portal at cde.ca.gov |
| **NV** | ESSA Plan | NV Dept of Education | No central portal — district websites |
| TX *(planned)* | TAPR / Campus Improvement Plan | Texas Education Agency | Large bond market |
| AZ *(planned)* | ESSA Plan | AZ Dept of Education | Fast-growing districts |
| WA *(planned)* | School Improvement Plan | OSPI | High ed-tech adoption |
| OR *(planned)* | School Improvement Plan | ODE | Measure 98 CTE signal |

**What works everywhere without state config:**
- YouTube board meeting transcripts
- Bond measures (Ballotpedia covers all 50 states)
- Leadership changes (Google News)
- District website scraping (generic fallback)

---

## Troubleshooting

**No signals created after running collectors**
- Check that `ORG_ID` is set in `.env`
- Verify intent_keywords were seeded: `SELECT COUNT(*) FROM intent_keywords WHERE org_id = 'your-org-id'`
- Run with `--days 90` to expand the lookback window
- Check YouTube API quota: 10,000 units/day default. Each search = ~100 units.

**YouTube transcripts missing**
- Not all board meetings have auto-captions enabled
- Districts that stream via Zoom or Webex often don't post to YouTube
- Check `youtube_videos` table — `has_transcript = false` rows show what was missed

**LCAP / state plan fetch returning nothing**
- CA districts: CDE portal is the best source but sometimes the URL structure changes
- Run `python collectors/state_plan_parser.py --district-ids <id> --states CA` and check logs
- Fall back: download LCAP PDFs manually and use `manual_bond_ingest()` pattern

**Digest email not sending**
- If `SENDGRID_API_KEY` is not set, digest prints to console — that's expected
- Check `DIGEST_EMAIL` is set to a real address
- Run with `--no-email` to print and debug the digest without sending

---

## File Structure

```
district-intelligence/
├── collectors/
│   ├── keyword_loader.py       ← intent-aware keyword engine (shared)
│   ├── youtube_monitor.py      ← board meeting transcripts
│   ├── state_plan_parser.py    ← LCAP / ESSA / state plans (all states)
│   ├── bond_tracker.py         ← bond measures
│   ├── leadership_monitor.py   ← superintendent/CTO turnover
│   └── run_all.py              ← master runner + digest
├── states/
│   ├── base.py                 ← StateConfig base class
│   ├── california.py           ← CA LCAP + CASH + EdSource
│   ├── nevada.py               ← NV ESSA plans + NDE
│   └── registry.py             ← get_state('CA') lookup
├── supabase/
│   ├── schema.sql
│   ├── schema_saas.sql
│   ├── schema_intents.sql
│   └── schema_signals_v2.sql
├── dashboard/
│   ├── index.html              ← main dashboard
│   ├── settings.html           ← keyword configuration
│   └── vertical-library.js     ← intent templates (all 14 verticals)
├── data/
│   └── pilot_districts.json
├── seed_lightspeed.py          ← one-time Lightspeed setup ← START HERE
├── .env.example
└── LIGHTSPEED.md               ← this file
```
