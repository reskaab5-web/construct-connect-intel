# District Intelligence Platform — Setup Guide

Sales intelligence system for K-12 instructional audio opportunities. Monitors YouTube board meetings, LCAP filings, bond measures, and leadership changes across 20 pilot districts.

---

## Architecture

```
YouTube Videos ──┐
LCAP Filings  ──┤─→ Python Collectors ──→ Supabase ──→ Dashboard (HTML)
Bond Measures ──┤                              └──→ Weekly Email Digest
Leadership    ──┘
```

---

## Step 1 — Create Supabase Project

1. Go to **https://supabase.com** → New Project
2. Name it `district-intelligence`, pick the region closest to you
3. Save the database password somewhere secure
4. Once created, go to **Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** key → `SUPABASE_SERVICE_KEY` (for Python collectors)
   - **anon** key → `SUPABASE_ANON_KEY` (for the dashboard)

---

## Step 2 — Run the Schema

1. In Supabase, open the **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste and click **Run**

This creates 7 tables, indexes, auto-scoring triggers, and a dashboard view.

---

## Step 3 — Get API Keys

### YouTube Data API v3
1. Go to https://console.developers.google.com/
2. Create a project → Enable **YouTube Data API v3**
3. Credentials → Create API Key
4. Copy to `YOUTUBE_API_KEY`

**Free quota:** 10,000 units/day. Each search = 100 units. 20 districts × ~3 searches = 6,000 units/run. Plenty.

### Anthropic (Claude)
1. Go to https://console.anthropic.com/
2. API Keys → Create key
3. Copy to `ANTHROPIC_API_KEY`

**Cost estimate:** ~$0.05–0.15 per full run (Haiku model for classification, Sonnet for digest)

### SendGrid (optional — for email digest)
1. Go to https://sendgrid.com/ → Free tier (100 emails/day)
2. Settings → API Keys → Create
3. Copy to `SENDGRID_API_KEY`

---

## Step 4 — Environment Setup

```bash
cd district-intelligence

# Copy env template
cp .env.example .env

# Edit with your values
nano .env   # or open in VS Code

# Install Python dependencies
pip install -r requirements.txt
```

Your `.env` file:
```
SUPABASE_URL=https://YOUR_REF.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci...
SUPABASE_ANON_KEY=eyJhbGci...
YOUTUBE_API_KEY=AIzaSy...
ANTHROPIC_API_KEY=sk-ant-...
SENDGRID_API_KEY=SG....          # optional
DIGEST_EMAIL=ron.sams@locallaunchmedia.com
```

Load env vars before running scripts:
```bash
export $(grep -v '^#' .env | xargs)
```

---

## Step 5 — Seed the Districts

```bash
cd collectors

# Preview what will be inserted
python seed_districts.py --dry-run

# Insert all 20 pilot districts
python seed_districts.py
```

You'll see 20 districts inserted with enrollment, state, website, and YouTube search queries pre-configured.

---

## Step 6 — Run the Collectors

### Test with a single run
```bash
cd collectors

# Full run, all districts, 90-day lookback
python run_all.py --days 90 --no-email

# Just YouTube monitor
python youtube_monitor.py --days 90

# Just leadership monitor
python leadership_monitor.py --days 90

# LCAP parser for CA districts
python lcap_parser.py --year 2024-25
```

### Run for specific districts (by UUID)
```bash
# Get district IDs from Supabase Table Editor first, then:
python run_all.py --district-ids UUID1 UUID2
```

---

## Step 7 — Open the Dashboard

1. Open `dashboard/index.html` in any browser (double-click the file)
2. Enter your **Supabase URL** and **anon key** in the sidebar
3. Click **Connect**

The dashboard reads live from Supabase. Data auto-updates when collectors run.

**Tabs:**
- **Districts** — card grid sorted by opportunity score, with filters by tier/state
- **Signal Feed** — chronological signal stream with strength ratings
- **Analytics** — score distribution, signal source breakdown, top districts chart

**Click any district card** to open a detail panel showing contacts, bonds, leadership changes, and all signals.

---

## Step 8 — Schedule Weekly Runs

### Option A: macOS launchd (recommended)
```bash
# Create plist
cat > ~/Library/LaunchAgents/com.locallaunch.district-intel.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.locallaunch.district-intel</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/bin/python3</string>
    <string>/PATH/TO/district-intelligence/collectors/run_all.py</string>
    <string>--days</string>
    <string>7</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>SUPABASE_URL</key>       <string>YOUR_VALUE</string>
    <key>SUPABASE_SERVICE_KEY</key><string>YOUR_VALUE</string>
    <key>YOUTUBE_API_KEY</key>    <string>YOUR_VALUE</string>
    <key>ANTHROPIC_API_KEY</key>  <string>YOUR_VALUE</string>
    <key>SENDGRID_API_KEY</key>   <string>YOUR_VALUE</string>
    <key>DIGEST_EMAIL</key>       <string>ron.sams@locallaunchmedia.com</string>
  </dict>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Weekday</key><integer>1</integer>  <!-- Monday -->
    <key>Hour</key><integer>7</integer>
    <key>Minute</key><integer>0</integer>
  </dict>
  <key>StandardOutPath</key><string>/tmp/district-intel.log</string>
  <key>StandardErrorPath</key><string>/tmp/district-intel-err.log</string>
</dict>
</plist>
EOF

# Load it
launchctl load ~/Library/LaunchAgents/com.locallaunch.district-intel.plist
```

### Option B: cron
```bash
crontab -e
# Add this line (runs every Monday at 7am):
0 7 * * 1 cd /PATH/TO/district-intelligence && export $(grep -v '^#' .env | xargs) && python collectors/run_all.py --days 7 >> logs/weekly.log 2>&1
```

---

## Adding More Districts

### Option 1: Edit pilot_districts.json and re-run seed
Add entries to `data/pilot_districts.json` using the same JSON structure, then:
```bash
python seed_districts.py
```
(Already-existing districts are skipped automatically.)

### Option 2: Insert directly in Supabase
Go to **Table Editor → districts** → Insert Row.

Required fields: `name`, `state`
Helpful fields: `website`, `enrollment`, `board_meeting_search_query`, `youtube_channel`

---

## Adding Bond Measures Manually

Bond data often requires manual entry from district websites, election results, or county records:

```python
from bond_tracker import manual_bond_ingest
from supabase import create_client

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

manual_bond_ingest({
    "district_id":   "UUID-FROM-DISTRICTS-TABLE",
    "measure_name":  "Measure J",
    "election_date": "2024-11-05",
    "amount":        45_000_000,
    "passed":        True,
    "vote_percentage": 67.2,
    "project_scope": "Upgrade classroom technology, including sound systems, PA/intercom replacement, and instructional audio district-wide. Renovation of 12 school sites.",
    "source_url":    "https://district-website.edu/bond",
}, supabase)
```

Claude will analyze the scope and auto-generate a signal with appropriate strength score.

---

## Opportunity Score Logic

Scores are calculated automatically by Supabase triggers whenever data changes:

| Signal | Points |
|--------|--------|
| Signal strength sum (all signals) | Up to 40 |
| Signals in last 90 days (5 pts each) | Up to 20 |
| Passed bonds mentioning AV (10 pts each) | Up to 20 |
| Leadership change in last year (10 pts each) | Up to 20 |
| LCAP mentions instructional audio | Up to 10 |
| **Total** | **100 max** |

**Tiers:** Hot ≥70 · Warm ≥40 · Cold ≥20 · Watch <20

---

## File Structure

```
district-intelligence/
├── supabase/
│   └── schema.sql              ← Run this in Supabase SQL Editor
├── collectors/
│   ├── youtube_monitor.py      ← Board meeting transcript analysis
│   ├── bond_tracker.py         ← Bond measure tracking + ingest
│   ├── lcap_parser.py          ← LCAP filing analysis
│   ├── leadership_monitor.py   ← Leadership change detection
│   ├── seed_districts.py       ← One-time district seeder
│   └── run_all.py              ← Master runner + email digest
├── dashboard/
│   └── index.html              ← Live dashboard (open in browser)
├── data/
│   └── pilot_districts.json    ← 20 pilot districts
├── requirements.txt
├── .env.example
└── SETUP.md                    ← This file
```

---

## Troubleshooting

**"No transcript available"** — Most board meeting videos have auto-captions. If a district posts unlisted or caption-disabled videos, transcripts won't be available. Consider manually uploading meeting minutes as PDFs.

**YouTube quota exceeded** — You get 10,000 units/day free. If running for >100 districts, stagger runs across multiple days or request a quota increase in Google Cloud Console.

**LCAP URL not found** — CA district LCAPs are available at: `https://www.cde.ca.gov/sp/sw/rq/lcaplinks.asp`. Search for your district and manually provide the URL via `process_district_lcap(district, supabase, lcap_url="URL_HERE")`.

**Supabase RLS blocking reads** — If the dashboard shows no data, ensure the anon read policies in schema.sql ran successfully. Check `Authentication → Policies` in Supabase dashboard.
