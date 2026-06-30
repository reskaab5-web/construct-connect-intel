/**
 * District Intelligence — Vertical Library
 * Complete intent + keyword templates for all supported verticals.
 *
 * Structure:
 *   VERTICALS[key] = {
 *     name, tagline, icon, color, who, dataSourceEmphasis,
 *     intents: [{ name, description, icon, color, weight, keywords: [{kw, w, context?}] }]
 *   }
 *
 * "weight" on an intent = how much a match lifts district opportunity score (1–10)
 * "w" on a keyword     = signal strength when this keyword fires (1–10)
 * "context"            = optional nearby-word requirement to reduce noise
 */

const VERTICALS = {

  // ──────────────────────────────────────────────────────────────────────────
  instructional_audio: {
    name:    "Instructional Audio",
    tagline: "Classroom sound systems, PA, hearing loops",
    icon:    "🔊",
    color:   "#6366f1",
    who:     "Lightspeed, Nureva, JLab, FrontRow, AV resellers",
    dataSourceEmphasis: {
      board_meetings: "HIGH — teachers and parents raise audio complaints directly",
      lcap:           "HIGH — technology goals often name specific audio needs",
      bonds:          "HIGH — AV systems are common bond project line items",
      leadership:     "HIGH — new sped directors and CTOs reset audio vendor relationships",
    },
    intents: [
      {
        name:        "District has active capital budget for audio/AV",
        description: "Money is allocated and moving — highest priority signal",
        icon: "💰", color: "#22c55e", weight: 10,
        keywords: [
          { kw: "bond passed",                  w: 10 },
          { kw: "bond approved",                w: 10 },
          { kw: "measure approved",             w: 9  },
          { kw: "lcap technology allocation",   w: 8  },
          { kw: "e-rate funding",               w: 7  },
          { kw: "technology budget approved",   w: 8  },
          { kw: "capital improvement program",  w: 6  },
          { kw: "title iv technology",          w: 6  },
          { kw: "esser technology",             w: 7  },
        ]
      },
      {
        name:        "Someone is complaining about current audio",
        description: "Active pain = immediate window to propose a solution",
        icon: "😤", color: "#ef4444", weight: 9,
        keywords: [
          { kw: "can't hear the teacher",       w: 10 },
          { kw: "students can't hear",          w: 10 },
          { kw: "hard to hear",                 w: 9  },
          { kw: "poor audio quality",           w: 9, context: "classroom" },
          { kw: "teacher voice fatigue",        w: 8  },
          { kw: "acoustics problem",            w: 7  },
          { kw: "noise issues",                 w: 6, context: "classroom" },
          { kw: "hearing complaint",            w: 7  },
          { kw: "audio feedback",               w: 6, context: "classroom" },
        ]
      },
      {
        name:        "New decision-maker in the seat",
        description: "New leaders reset vendor relationships — receptivity window lasts ~6 months",
        icon: "👤", color: "#f97316", weight: 8,
        keywords: [
          { kw: "new superintendent",           w: 8  },
          { kw: "superintendent named",         w: 8  },
          { kw: "superintendent appointed",     w: 8  },
          { kw: "new CTO",                      w: 8  },
          { kw: "technology director hired",    w: 8  },
          { kw: "new director of technology",   w: 7  },
          { kw: "director of special education", w: 7 },
          { kw: "superintendent retiring",      w: 6  },
        ]
      },
      {
        name:        "Facility project touching classrooms",
        description: "Renovation/construction always includes AV scope — get in before specs are written",
        icon: "🏗️", color: "#6366f1", weight: 7,
        keywords: [
          { kw: "classroom renovation",         w: 8  },
          { kw: "new school construction",      w: 8  },
          { kw: "modernization project",        w: 7  },
          { kw: "facility improvement",         w: 6  },
          { kw: "school remodel",               w: 6  },
          { kw: "construction bond",            w: 6  },
          { kw: "dsa approval",                 w: 5  },
          { kw: "portable classrooms",          w: 5  },
        ]
      },
      {
        name:        "Legal/compliance pressure around hearing access",
        description: "IEP and ADA requirements create non-discretionary purchasing obligations",
        icon: "⚖️", color: "#eab308", weight: 9,
        keywords: [
          { kw: "hearing impaired students",    w: 9  },
          { kw: "ADA compliance",               w: 8  },
          { kw: "504 accommodation",            w: 8, context: "hearing" },
          { kw: "IEP technology",               w: 8  },
          { kw: "IDEA requirement",             w: 7  },
          { kw: "assistive technology",         w: 6  },
          { kw: "special education audio",      w: 8  },
          { kw: "deaf and hard of hearing",     w: 9  },
          { kw: "ELL classroom support",        w: 6  },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  paging_intercom: {
    name:    "Paging & Intercom",
    tagline: "Campus communication, IP intercom, bell systems",
    icon:    "📢",
    color:   "#0ea5e9",
    who:     "Telecor, Rauland, Gallagher, Aiphone, AtlasIED, IP intercom vendors",
    dataSourceEmphasis: {
      board_meetings: "HIGH — infrastructure failures get escalated to board level",
      lcap:           "MEDIUM — appears under safety or communication goals",
      bonds:          "VERY HIGH — intercom/paging is almost always a bond project item",
      leadership:     "MEDIUM — facilities directors drive this purchase",
    },
    intents: [
      {
        name:        "Aging or failing communication infrastructure",
        description: "Systems past end-of-life or actively failing = emergency replacement cycle",
        icon: "🔧", color: "#ef4444", weight: 10,
        keywords: [
          { kw: "intercom replacement",         w: 10 },
          { kw: "paging system replacement",    w: 10 },
          { kw: "pa system failure",            w: 10 },
          { kw: "bell system upgrade",          w: 9  },
          { kw: "analog intercom",              w: 8  },
          { kw: "communication system failure", w: 9  },
          { kw: "outdated intercom",            w: 8  },
          { kw: "intercom not working",         w: 9  },
          { kw: "end of life",                  w: 7, context: "intercom" },
        ]
      },
      {
        name:        "Bond-funded campus communication upgrade",
        description: "Active bond with communication systems in project scope",
        icon: "💰", color: "#22c55e", weight: 10,
        keywords: [
          { kw: "intercom upgrade",             w: 9, context: "bond" },
          { kw: "communication systems",        w: 7, context: "bond"  },
          { kw: "paging system",                w: 7, context: "bond"  },
          { kw: "campus communication",         w: 7  },
          { kw: "pa replacement",               w: 8  },
          { kw: "bond technology scope",        w: 7  },
          { kw: "bond passed",                  w: 7  },
          { kw: "public address system",        w: 7  },
        ]
      },
      {
        name:        "New construction requiring communication infrastructure spec",
        description: "New buildings need intercom from scratch — easiest to spec in early",
        icon: "🏗️", color: "#6366f1", weight: 9,
        keywords: [
          { kw: "new school construction",      w: 9  },
          { kw: "new building",                 w: 7, context: "school"    },
          { kw: "construction documents",       w: 7  },
          { kw: "technology specifications",    w: 7  },
          { kw: "dsa approval",                 w: 8  },
          { kw: "architect selection",          w: 7  },
          { kw: "structured cabling",           w: 7  },
          { kw: "low voltage",                  w: 6, context: "school"    },
        ]
      },
      {
        name:        "Emergency notification or safety requirement",
        description: "State laws and safety incidents drive intercom procurement on short timelines",
        icon: "🚨", color: "#f97316", weight: 9,
        keywords: [
          { kw: "alyssa's law",                 w: 10 },
          { kw: "silent panic button",          w: 10 },
          { kw: "emergency notification",       w: 8  },
          { kw: "lockdown communication",       w: 9  },
          { kw: "mass notification",            w: 8  },
          { kw: "school safety compliance",     w: 8  },
          { kw: "two-way communication",        w: 7, context: "safety"   },
          { kw: "emergency alert system",       w: 8  },
        ]
      },
      {
        name:        "IP/network transition opportunity",
        description: "Districts migrating from analog to IP create full system replacement opportunities",
        icon: "🌐", color: "#8b5cf6", weight: 7,
        keywords: [
          { kw: "ip intercom",                  w: 9  },
          { kw: "voip",                         w: 6, context: "school"    },
          { kw: "network upgrade",              w: 6  },
          { kw: "analog to ip",                 w: 9  },
          { kw: "sip protocol",                 w: 8  },
          { kw: "unified communications",       w: 7, context: "school"    },
          { kw: "e-rate category 2",            w: 7  },
          { kw: "infrastructure modernization", w: 7  },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  av_integrators: {
    name:    "AV / IT Integrators",
    tagline: "Systems integrators who install and commission",
    icon:    "🔌",
    color:   "#10b981",
    who:     "AV integrators, IT resellers, low-voltage contractors, technology project firms",
    note:    "Integrators need project-level signals, not product signals. Focus on bid opportunities and project timelines.",
    dataSourceEmphasis: {
      board_meetings: "HIGH — board approves contracts, hears project updates",
      lcap:           "MEDIUM — budget approval, less about project details",
      bonds:          "VERY HIGH — every bond project is a bid opportunity",
      leadership:     "HIGH — new facilities directors open vendor relationships",
    },
    intents: [
      {
        name:        "Active RFP or bid opportunity issued",
        description: "Procurement is open — respond immediately",
        icon: "📄", color: "#ef4444", weight: 10,
        keywords: [
          { kw: "rfp technology",               w: 10 },
          { kw: "request for proposal",         w: 9, context: "technology" },
          { kw: "technology bid",               w: 10 },
          { kw: "bid opening",                  w: 9  },
          { kw: "design-build rfp",             w: 9  },
          { kw: "av bid",                       w: 10 },
          { kw: "technology integrator",        w: 9  },
          { kw: "systems integrator",           w: 9  },
          { kw: "sole source",                  w: 8, context: "technology" },
          { kw: "technology contract awarded",  w: 9  },
        ]
      },
      {
        name:        "Bond project in planning or design phase",
        description: "Get in the door during design — influence the technology spec before bid day",
        icon: "📐", color: "#6366f1", weight: 9,
        keywords: [
          { kw: "bond passed",                  w: 9  },
          { kw: "facilities master plan",       w: 8  },
          { kw: "architect selection",          w: 9  },
          { kw: "design development",           w: 8  },
          { kw: "dsa approval",                 w: 9  },
          { kw: "construction documents",       w: 8  },
          { kw: "technology specifications",    w: 9  },
          { kw: "infrastructure planning",      w: 7  },
          { kw: "project manager hired",        w: 8  },
        ]
      },
      {
        name:        "E-rate Category 2 procurement window",
        description: "Annual e-rate cycle drives predictable network/Wi-Fi procurement",
        icon: "📡", color: "#f97316", weight: 8,
        keywords: [
          { kw: "e-rate category 2",            w: 10 },
          { kw: "e-rate application",           w: 9  },
          { kw: "wi-fi upgrade",                w: 8  },
          { kw: "wireless infrastructure",      w: 8  },
          { kw: "network equipment bid",        w: 9  },
          { kw: "e-rate funding year",          w: 8  },
          { kw: "form 470",                     w: 9  },
          { kw: "competitive bid e-rate",       w: 9  },
        ]
      },
      {
        name:        "New construction with technology scope",
        description: "New buildings need complete technology infrastructure — AV, IT, low-voltage",
        icon: "🏗️", color: "#22c55e", weight: 9,
        keywords: [
          { kw: "new school construction",      w: 9  },
          { kw: "new building technology",      w: 9  },
          { kw: "structured cabling",           w: 9  },
          { kw: "low voltage contractor",       w: 9  },
          { kw: "technology package",           w: 8, context: "school"    },
          { kw: "av design",                    w: 9  },
          { kw: "it infrastructure",            w: 7, context: "school"    },
          { kw: "classroom technology package", w: 9  },
        ]
      },
      {
        name:        "Technology refresh creating deployment opportunity",
        description: "Large-scale rollouts need project management and installation labor",
        icon: "🔄", color: "#eab308", weight: 7,
        keywords: [
          { kw: "device rollout",               w: 8  },
          { kw: "technology deployment",        w: 8  },
          { kw: "equipment installation",       w: 8  },
          { kw: "1:1 deployment",               w: 7  },
          { kw: "chromebook rollout",           w: 7  },
          { kw: "panel installation",           w: 8  },
          { kw: "interactive display",          w: 8  },
          { kw: "projector replacement",        w: 7  },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  special_education: {
    name:    "Special Education",
    tagline: "Assistive tech, sped programs, IEP compliance",
    icon:    "🎓",
    color:   "#8b5cf6",
    who:     "Assistive tech vendors, sped staffing agencies, IEP software, AAC device providers",
    dataSourceEmphasis: {
      board_meetings: "HIGH — due process, sped audits, and program changes surface at board",
      lcap:           "VERY HIGH — LCAP Goal 1 almost always covers sped student outcomes",
      bonds:          "MEDIUM — accessibility upgrades included in facility bonds",
      leadership:     "VERY HIGH — director of special ed turnover = immediate relationship reset",
    },
    intents: [
      {
        name:        "Compliance pressure or due process risk",
        description: "OCR complaints and due process create mandatory, fast spending — non-discretionary",
        icon: "⚖️", color: "#ef4444", weight: 10,
        keywords: [
          { kw: "ocr complaint",                w: 10 },
          { kw: "due process hearing",          w: 10 },
          { kw: "consent decree",               w: 10 },
          { kw: "compliance audit",             w: 9, context: "special education" },
          { kw: "idea compliance",              w: 9  },
          { kw: "corrective action plan",       w: 9  },
          { kw: "sped audit",                   w: 9  },
          { kw: "accessibility compliance",     w: 8  },
          { kw: "ADA violation",                w: 9  },
        ]
      },
      {
        name:        "IDEA or Title III funding available for assistive tech",
        description: "Federal sped funding = dedicated budget for assistive technology",
        icon: "💰", color: "#22c55e", weight: 9,
        keywords: [
          { kw: "idea part b",                  w: 9  },
          { kw: "assistive technology budget",  w: 10 },
          { kw: "sped technology allocation",   w: 9  },
          { kw: "title iii technology",         w: 8  },
          { kw: "assistive technology IEP",     w: 9  },
          { kw: "AT assessment",                w: 8  },
          { kw: "augmentative communication",   w: 9  },
          { kw: "AAC device",                   w: 9  },
          { kw: "special education technology", w: 8  },
        ]
      },
      {
        name:        "New or expanded sped program",
        description: "New programs require new equipment, staffing, and software",
        icon: "🆕", color: "#6366f1", weight: 8,
        keywords: [
          { kw: "new autism program",           w: 9  },
          { kw: "sped program expansion",       w: 9  },
          { kw: "new resource specialist",      w: 7  },
          { kw: "deaf and hard of hearing program", w: 9 },
          { kw: "DHH program",                  w: 9  },
          { kw: "visually impaired program",    w: 8  },
          { kw: "new SDC classroom",            w: 8  },
          { kw: "SELPA program",                w: 7  },
          { kw: "behavior support program",     w: 7  },
        ]
      },
      {
        name:        "New director of special education or SELPA administrator",
        description: "New sped directors run program audits and immediately reevaluate vendor relationships",
        icon: "👤", color: "#f97316", weight: 9,
        keywords: [
          { kw: "director of special education", w: 9 },
          { kw: "special education director",   w: 9  },
          { kw: "selpa director",               w: 9  },
          { kw: "special services director",    w: 8  },
          { kw: "new director of sped",         w: 9  },
          { kw: "assistant superintendent special education", w: 8 },
          { kw: "new sped coordinator",         w: 7  },
        ]
      },
      {
        name:        "Growing sped student population",
        description: "Enrollment growth in sped creates proportional technology and staffing demand",
        icon: "📈", color: "#eab308", weight: 7,
        keywords: [
          { kw: "sped enrollment growth",       w: 8  },
          { kw: "increased IEP students",       w: 8  },
          { kw: "autism enrollment",            w: 7  },
          { kw: "special education caseload",   w: 7  },
          { kw: "504 plan increase",            w: 7  },
          { kw: "growing special needs",        w: 7  },
          { kw: "sped waitlist",                w: 8  },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  tutoring: {
    name:    "Tutoring & Supplemental Programs",
    tagline: "Intervention curriculum, after-school, tutoring vendors",
    icon:    "📚",
    color:   "#f59e0b",
    who:     "Tutoring companies, curriculum publishers, after-school providers, intervention software",
    dataSourceEmphasis: {
      board_meetings: "HIGH — academic performance and intervention programs are routine board topics",
      lcap:           "VERY HIGH — LCAP is built around student outcome goals with intervention budgets",
      bonds:          "LOW — bonds rarely fund tutoring directly",
      leadership:     "HIGH — new superintendents with 'academic turnaround' mandates are ideal customers",
    },
    intents: [
      {
        name:        "District underperforming on state assessments",
        description: "Low test scores trigger mandatory intervention spending under ESSA and state law",
        icon: "📉", color: "#ef4444", weight: 10,
        keywords: [
          { kw: "below proficiency",            w: 9  },
          { kw: "academic intervention",        w: 9  },
          { kw: "test scores declining",        w: 9  },
          { kw: "sbac results",                 w: 8  },
          { kw: "essa comprehensive support",   w: 10 },
          { kw: "targeted support school",      w: 9  },
          { kw: "improvement required",         w: 8, context: "academic"  },
          { kw: "chronic absenteeism",          w: 7  },
          { kw: "achievement gap",              w: 8  },
          { kw: "learning loss",                w: 8  },
        ]
      },
      {
        name:        "Title I or LCAP intervention budget",
        description: "Dedicated federal and state funding for supplemental academic programs",
        icon: "💰", color: "#22c55e", weight: 9,
        keywords: [
          { kw: "title i supplemental",         w: 9  },
          { kw: "esser academic recovery",      w: 10 },
          { kw: "high dosage tutoring",         w: 10 },
          { kw: "tutoring program",             w: 9  },
          { kw: "intervention funds",           w: 9  },
          { kw: "lcap academic goal",           w: 8  },
          { kw: "academic support budget",      w: 8  },
          { kw: "supplemental services",        w: 8  },
          { kw: "extended learning",            w: 7  },
        ]
      },
      {
        name:        "After-school or extended learning program",
        description: "Programs seeking curriculum partners, tutors, or program management",
        icon: "🌅", color: "#f97316", weight: 8,
        keywords: [
          { kw: "after school program",         w: 9  },
          { kw: "extended day",                 w: 8  },
          { kw: "summer school",                w: 8  },
          { kw: "21st century learning",        w: 8  },
          { kw: "expanded learning",            w: 8  },
          { kw: "before and after school",      w: 8  },
          { kw: "ases grant",                   w: 9  },
          { kw: "out of school time",           w: 8  },
          { kw: "enrichment program",           w: 6  },
        ]
      },
      {
        name:        "New superintendent with academic turnaround mandate",
        description: "'Improve student outcomes' is the new superintendent's first public commitment",
        icon: "👤", color: "#8b5cf6", weight: 9,
        keywords: [
          { kw: "new superintendent",           w: 8  },
          { kw: "academic turnaround",          w: 9  },
          { kw: "student achievement focus",    w: 8  },
          { kw: "improvement plan",             w: 8, context: "academic"  },
          { kw: "superintendent academic",      w: 8  },
          { kw: "strategic plan education",     w: 7  },
          { kw: "board goals academic",         w: 7  },
        ]
      },
      {
        name:        "ELL or multilingual learner program expansion",
        description: "Growing ELL populations require specialized tutoring and language intervention",
        icon: "🌎", color: "#0ea5e9", weight: 7,
        keywords: [
          { kw: "ell program expansion",        w: 8  },
          { kw: "english learner support",      w: 8  },
          { kw: "multilingual learner",         w: 8  },
          { kw: "language acquisition",         w: 7, context: "program"   },
          { kw: "newcomer program",             w: 8  },
          { kw: "dual language",                w: 7  },
          { kw: "bilingual tutoring",           w: 8  },
          { kw: "title iii ell",               w: 8  },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  edtech_devices: {
    name:    "EdTech & Devices",
    tagline: "1:1 programs, device refresh, LMS, digital curriculum",
    icon:    "💻",
    color:   "#3b82f6",
    who:     "CDW-G, Apple, HP, device resellers, LMS vendors, digital curriculum publishers",
    dataSourceEmphasis: {
      board_meetings: "MEDIUM — board approves large technology purchases",
      lcap:           "VERY HIGH — nearly every LCAP has technology goals",
      bonds:          "HIGH — devices and infrastructure included in many bonds",
      leadership:     "HIGH — new CTOs immediately evaluate existing device strategy",
    },
    intents: [
      {
        name:        "Device refresh cycle approaching",
        description: "1:1 programs run on 3–5 year cycles — district is due for replacement",
        icon: "🔄", color: "#6366f1", weight: 10,
        keywords: [
          { kw: "device refresh",               w: 10 },
          { kw: "chromebook replacement",       w: 10 },
          { kw: "1:1 refresh",                  w: 10 },
          { kw: "aging devices",                w: 9  },
          { kw: "technology lifecycle",         w: 8  },
          { kw: "outdated devices",             w: 9  },
          { kw: "device replacement plan",      w: 9  },
          { kw: "end of support",               w: 8, context: "devices"   },
        ]
      },
      {
        name:        "ESSER or federal funding window closing",
        description: "ESSER deadlines create urgent spending — districts must obligate funds or lose them",
        icon: "⏰", color: "#ef4444", weight: 10,
        keywords: [
          { kw: "esser funds",                  w: 10 },
          { kw: "esser iii",                    w: 10 },
          { kw: "esser deadline",               w: 10 },
          { kw: "arpa education",               w: 9  },
          { kw: "federal technology grant",     w: 8  },
          { kw: "obligate funds",               w: 9  },
          { kw: "unspent esser",                w: 10 },
        ]
      },
      {
        name:        "New 1:1 or digital equity initiative",
        description: "New programs require full device procurement from scratch",
        icon: "🆕", color: "#22c55e", weight: 9,
        keywords: [
          { kw: "1:1 initiative",               w: 10 },
          { kw: "digital equity program",       w: 9  },
          { kw: "student device program",       w: 9  },
          { kw: "one to one",                   w: 9  },
          { kw: "device lending",               w: 8  },
          { kw: "take home device",             w: 8  },
          { kw: "homework gap",                 w: 7  },
        ]
      },
      {
        name:        "New CTO or Director of Technology hired",
        description: "Technology leaders evaluate every contract in their first 90 days",
        icon: "👤", color: "#f97316", weight: 8,
        keywords: [
          { kw: "new CTO",                      w: 9  },
          { kw: "director of technology",       w: 8  },
          { kw: "technology director hired",    w: 9  },
          { kw: "chief technology officer",     w: 8  },
          { kw: "it director",                  w: 7  },
          { kw: "instructional technology director", w: 8 },
        ]
      },
      {
        name:        "LCAP lists technology as a strategic priority",
        description: "LCAP tech goal = approved budget heading into the fiscal year",
        icon: "📋", color: "#8b5cf6", weight: 8,
        keywords: [
          { kw: "lcap technology goal",         w: 9  },
          { kw: "technology priority",          w: 7, context: "lcap"      },
          { kw: "digital learning goal",        w: 8  },
          { kw: "instructional technology",     w: 7, context: "lcap"      },
          { kw: "edtech budget",                w: 8  },
          { kw: "device procurement",           w: 8  },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  safety_security: {
    name:    "Safety & Security",
    tagline: "Cameras, access control, mass notification, visitor management",
    icon:    "🔒",
    color:   "#dc2626",
    who:     "Verkada, Avigilon, Motorola Solutions, Rave Mobile Safety, Raptor Technologies",
    dataSourceEmphasis: {
      board_meetings: "HIGH — safety incidents and mandates are always board-level topics",
      lcap:           "MEDIUM — safety goals appear but often without product detail",
      bonds:          "VERY HIGH — safety bond measures are a distinct and growing category",
      leadership:     "HIGH — new superintendents always have a safety agenda",
    },
    intents: [
      {
        name:        "Safety incident or threat at a district",
        description: "Post-incident purchasing is fast, budget-flexible, and often sole-sourced",
        icon: "🚨", color: "#ef4444", weight: 10,
        keywords: [
          { kw: "security incident",            w: 10 },
          { kw: "lockdown",                     w: 9, context: "school"    },
          { kw: "threat assessment",            w: 9  },
          { kw: "campus safety concern",        w: 8  },
          { kw: "intruder",                     w: 9, context: "school"    },
          { kw: "fight on campus",              w: 8  },
          { kw: "weapons on campus",            w: 9  },
          { kw: "emergency response",           w: 7, context: "school"    },
        ]
      },
      {
        name:        "Safety bond measure or grant approved",
        description: "Dedicated safety funding = direct, fast procurement path",
        icon: "💰", color: "#22c55e", weight: 10,
        keywords: [
          { kw: "school safety bond",           w: 10 },
          { kw: "safety grant approved",        w: 10 },
          { kw: "stop school violence",         w: 9  },
          { kw: "safe schools act",             w: 9  },
          { kw: "school safety funding",        w: 9  },
          { kw: "security measure passed",      w: 9  },
          { kw: "campus security bond",         w: 10 },
        ]
      },
      {
        name:        "State safety law compliance deadline",
        description: "State mandates (Alyssa's Law, etc.) create legal deadlines for specific products",
        icon: "⚖️", color: "#f97316", weight: 10,
        keywords: [
          { kw: "alyssa's law",                 w: 10 },
          { kw: "silent panic button",          w: 10 },
          { kw: "school safety mandate",        w: 9  },
          { kw: "compliance deadline",          w: 8, context: "safety"    },
          { kw: "state safety requirement",     w: 9  },
          { kw: "sfsc compliance",              w: 8  },
          { kw: "ab 276",                       w: 9  },
        ]
      },
      {
        name:        "Aging or failing security infrastructure",
        description: "Camera failures and obsolete access control create replacement urgency",
        icon: "📷", color: "#8b5cf6", weight: 9,
        keywords: [
          { kw: "camera system replacement",    w: 10 },
          { kw: "security camera upgrade",      w: 9  },
          { kw: "access control replacement",   w: 10 },
          { kw: "obsolete security",            w: 8  },
          { kw: "visitor management upgrade",   w: 8  },
          { kw: "door security",                w: 7  },
          { kw: "key fob system",               w: 7  },
        ]
      },
      {
        name:        "New superintendent or principal with safety agenda",
        description: "Safety is almost always the first public priority for new district leaders",
        icon: "👤", color: "#0ea5e9", weight: 8,
        keywords: [
          { kw: "new superintendent",           w: 7  },
          { kw: "safe schools initiative",      w: 8  },
          { kw: "safety audit",                 w: 8  },
          { kw: "security assessment",          w: 8  },
          { kw: "campus safety review",         w: 8  },
          { kw: "superintendent safety",        w: 8  },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  construction_facilities: {
    name:    "Construction & Facilities",
    tagline: "GCs, architects, engineers, specialty subs, geotech",
    icon:    "🏗️",
    color:   "#78716c",
    who:     "General contractors, architects, MEP engineers, geotechnical firms, specialty subcontractors",
    note:    "Geotech firms (e.g. Byerly) should add custom keywords: 'soil report', 'site assessment', 'geotechnical investigation', 'grading permit', 'environmental study'",
    dataSourceEmphasis: {
      board_meetings: "HIGH — board approves contracts, hears project updates",
      lcap:           "LOW — construction not usually in LCAP",
      bonds:          "CRITICAL — every bond passage is a bid opportunity",
      leadership:     "HIGH — new facilities directors open vendor evaluation",
    },
    intents: [
      {
        name:        "Bond measure passed — construction budget released",
        description: "The starting gun for every facilities project — move immediately",
        icon: "🏛️", color: "#22c55e", weight: 10,
        keywords: [
          { kw: "bond passed",                  w: 10 },
          { kw: "measure approved",             w: 10 },
          { kw: "bond election results",        w: 9  },
          { kw: "construction fund released",   w: 9  },
          { kw: "bond authorized",              w: 9  },
          { kw: "voters approved",              w: 8, context: "bond"      },
          { kw: "bond proceeds",                w: 8  },
        ]
      },
      {
        name:        "Active RFP, bid, or contract opportunity",
        description: "Procurement is open — respond immediately",
        icon: "📄", color: "#ef4444", weight: 10,
        keywords: [
          { kw: "construction rfp",             w: 10 },
          { kw: "construction bid",             w: 10 },
          { kw: "bid opening",                  w: 9, context: "school"    },
          { kw: "request for qualifications",   w: 9  },
          { kw: "design-build rfp",             w: 10 },
          { kw: "lease-leaseback",              w: 9  },
          { kw: "cm at risk",                   w: 9  },
          { kw: "contract awarded",             w: 8, context: "school"    },
          { kw: "architect selected",           w: 8  },
        ]
      },
      {
        name:        "Facilities master plan or needs assessment underway",
        description: "Planning phase = 12–24 months before ground breaks — ideal time to get on record",
        icon: "📐", color: "#6366f1", weight: 8,
        keywords: [
          { kw: "facilities master plan",       w: 9  },
          { kw: "needs assessment",             w: 8, context: "facilities" },
          { kw: "facility condition report",    w: 9  },
          { kw: "deferred maintenance study",   w: 8  },
          { kw: "fca report",                   w: 8  },
          { kw: "infrastructure assessment",    w: 7  },
          { kw: "bond planning",                w: 8  },
          { kw: "capital planning",             w: 7  },
        ]
      },
      {
        name:        "DSA approval or construction permit issued",
        description: "DSA approval = project is imminent, mobilization happening within weeks",
        icon: "✅", color: "#f97316", weight: 9,
        keywords: [
          { kw: "dsa approval",                 w: 10 },
          { kw: "division of state architect",  w: 9  },
          { kw: "building permit issued",       w: 9  },
          { kw: "groundbreaking",               w: 9  },
          { kw: "construction start",           w: 8, context: "school"    },
          { kw: "notice to proceed",            w: 9  },
          { kw: "dsa certified",                w: 9  },
        ]
      },
      {
        name:        "New facilities director or project manager",
        description: "New leaders run vendor evaluations — warm outreach has high conversion",
        icon: "👤", color: "#8b5cf6", weight: 8,
        keywords: [
          { kw: "facilities director",          w: 8  },
          { kw: "director of facilities",       w: 8  },
          { kw: "project manager hired",        w: 8  },
          { kw: "director of operations",       w: 7  },
          { kw: "maintenance director",         w: 7  },
          { kw: "chief facilities officer",     w: 8  },
          { kw: "new facilities manager",       w: 8  },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  stem_steam: {
    name:    "STEM / STEAM",
    tagline: "Lab equipment, maker spaces, science & engineering programs",
    icon:    "🔬",
    color:   "#06b6d4",
    who:     "Lab equipment suppliers, 3D printing vendors, robotics companies, maker space designers, STEM curriculum publishers",
    dataSourceEmphasis: {
      board_meetings: "HIGH — STEM program launches and lab renovations get board spotlight",
      lcap:           "VERY HIGH — LCAP college/career readiness goals drive STEM investment",
      bonds:          "HIGH — science lab renovations and maker spaces are common bond line items",
      leadership:     "MEDIUM — new curriculum directors often push STEM initiatives",
    },
    intents: [
      {
        name:        "New or expanding STEM/STEAM program",
        description: "Program launch or expansion = full equipment procurement from scratch",
        icon: "🚀", color: "#22c55e", weight: 10,
        keywords: [
          { kw: "stem program launch",             w: 10 },
          { kw: "steam program",                   w: 9  },
          { kw: "maker space",                     w: 9  },
          { kw: "makerspace",                      w: 9  },
          { kw: "fabrication lab",                 w: 9  },
          { kw: "fab lab",                         w: 9  },
          { kw: "innovation lab",                  w: 8  },
          { kw: "stem expansion",                  w: 9  },
          { kw: "new science program",             w: 8  },
          { kw: "robotics program",                w: 9  },
        ]
      },
      {
        name:        "Science lab renovation or construction",
        description: "Lab remodel always includes new equipment spec — get in before design phase ends",
        icon: "🏗️", color: "#6366f1", weight: 9,
        keywords: [
          { kw: "science lab renovation",          w: 10 },
          { kw: "lab modernization",               w: 9  },
          { kw: "science classroom upgrade",       w: 9  },
          { kw: "laboratory renovation",           w: 9  },
          { kw: "new science building",            w: 9  },
          { kw: "stem facility",                   w: 8  },
          { kw: "lab casework",                    w: 8  },
          { kw: "fume hood replacement",           w: 8  },
        ]
      },
      {
        name:        "STEM-related grant or CTE funding",
        description: "Federal and state grants specifically earmarked for STEM and career-tech programs",
        icon: "💰", color: "#f59e0b", weight: 9,
        keywords: [
          { kw: "stem grant",                      w: 10 },
          { kw: "steam grant",                     w: 10 },
          { kw: "perkins grant",                   w: 9, context: "stem"     },
          { kw: "title iv stem",                   w: 9  },
          { kw: "innovation grant",                w: 8, context: "school"   },
          { kw: "nsf grant",                       w: 8  },
          { kw: "department of energy grant",      w: 8  },
          { kw: "stem funding approved",           w: 9  },
        ]
      },
      {
        name:        "Robotics or coding initiative",
        description: "Competition programs and coding mandates drive dedicated equipment purchases",
        icon: "🤖", color: "#8b5cf6", weight: 8,
        keywords: [
          { kw: "robotics team",                   w: 8  },
          { kw: "first robotics",                  w: 9  },
          { kw: "coding curriculum",               w: 8  },
          { kw: "computer science program",        w: 8  },
          { kw: "3d printing",                     w: 8  },
          { kw: "laser cutter",                    w: 8  },
          { kw: "drone program",                   w: 8  },
          { kw: "engineering design",              w: 7, context: "school"   },
          { kw: "vex robotics",                    w: 8  },
        ]
      },
      {
        name:        "College & career readiness goal in LCAP or strategic plan",
        description: "C&CR goals often translate directly into STEM equipment and program investment",
        icon: "🎯", color: "#f97316", weight: 7,
        keywords: [
          { kw: "college career readiness",        w: 8  },
          { kw: "career pathway stem",             w: 9  },
          { kw: "work-based learning",             w: 8  },
          { kw: "industry partnership",            w: 7, context: "school"   },
          { kw: "stem pipeline",                   w: 8  },
          { kw: "dual enrollment stem",            w: 8  },
          { kw: "science engineering goal",        w: 7  },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  cte_career_tech: {
    name:    "CTE / Career Technical Education",
    tagline: "Woodshop, auto, culinary, welding, trade program equipment",
    icon:    "🛠️",
    color:   "#d97706",
    who:     "Woodworking machinery, auto shop equipment, culinary supplies, welding equipment, trade program furniture vendors",
    dataSourceEmphasis: {
      board_meetings: "HIGH — CTE program approvals and Perkins compliance go to board",
      lcap:           "HIGH — college & career readiness goals fund CTE programs",
      bonds:          "VERY HIGH — CTE shop renovations are major bond projects",
      leadership:     "MEDIUM — new CTE directors and curriculum VPs reset vendor relationships",
    },
    intents: [
      {
        name:        "Perkins V grant cycle — CTE funding approved",
        description: "Perkins is the primary federal CTE funding vehicle — districts plan equipment purchases annually around it",
        icon: "💰", color: "#22c55e", weight: 10,
        keywords: [
          { kw: "perkins v",                       w: 10 },
          { kw: "perkins grant",                   w: 10 },
          { kw: "perkins funding",                 w: 10 },
          { kw: "carl perkins",                    w: 9  },
          { kw: "cte grant",                       w: 9  },
          { kw: "career technical funding",        w: 9  },
          { kw: "cte allocation",                  w: 9  },
          { kw: "perkins application approved",    w: 10 },
        ]
      },
      {
        name:        "CTE shop renovation or new construction",
        description: "Shop renovations require complete equipment replacement — GCs, machinery, and furniture",
        icon: "🏗️", color: "#6366f1", weight: 10,
        keywords: [
          { kw: "woodshop renovation",             w: 10 },
          { kw: "auto shop upgrade",               w: 10 },
          { kw: "culinary kitchen renovation",     w: 10 },
          { kw: "welding lab",                     w: 9  },
          { kw: "cte facility",                    w: 9  },
          { kw: "shop classroom renovation",       w: 9  },
          { kw: "career center construction",      w: 9  },
          { kw: "trade program facility",          w: 8  },
          { kw: "cte building",                    w: 8  },
        ]
      },
      {
        name:        "New CTE pathway or program launch",
        description: "New pathways require curriculum, equipment, and industry partnerships from scratch",
        icon: "🆕", color: "#ef4444", weight: 9,
        keywords: [
          { kw: "new cte pathway",                 w: 10 },
          { kw: "new career pathway",              w: 9  },
          { kw: "new trade program",               w: 9  },
          { kw: "culinary arts program",           w: 9  },
          { kw: "automotive program",              w: 9  },
          { kw: "construction pathway",            w: 9  },
          { kw: "healthcare pathway",              w: 8  },
          { kw: "manufacturing program",           w: 9  },
          { kw: "cte expansion",                   w: 9  },
        ]
      },
      {
        name:        "CTE equipment aging or out of compliance",
        description: "Safety compliance and aging machinery create mandatory replacement — often board-level urgent",
        icon: "⚠️", color: "#f97316", weight: 9,
        keywords: [
          { kw: "shop equipment replacement",      w: 10 },
          { kw: "outdated machinery",              w: 9  },
          { kw: "equipment safety audit",          w: 9, context: "school"   },
          { kw: "osha compliance",                 w: 8, context: "school"   },
          { kw: "unsafe equipment",                w: 9, context: "school"   },
          { kw: "machinery end of life",           w: 9  },
          { kw: "shop safety inspection",          w: 8  },
        ]
      },
      {
        name:        "Industry partnership or work-based learning expansion",
        description: "Industry partnerships require equipment matching real-world tools used in the field",
        icon: "🤝", color: "#8b5cf6", weight: 7,
        keywords: [
          { kw: "industry partner",                w: 8, context: "cte"      },
          { kw: "work-based learning",             w: 8  },
          { kw: "apprenticeship program",          w: 8  },
          { kw: "internship cte",                  w: 7  },
          { kw: "dual enrollment cte",             w: 8  },
          { kw: "community college partnership",   w: 7  },
          { kw: "regional occupational",           w: 8  },
          { kw: "rop program",                     w: 8  },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  sports_athletics: {
    name:    "Sports & Athletics",
    tagline: "PE equipment, gym flooring, scoreboards, athletic facilities",
    icon:    "🏆",
    color:   "#16a34a",
    who:     "PE equipment suppliers, gym flooring companies, scoreboard vendors, bleacher manufacturers, sports surface contractors",
    dataSourceEmphasis: {
      board_meetings: "HIGH — athletic facility projects and bond allocations surface at board",
      lcap:           "LOW — athletics rarely in LCAP; PE equipment sometimes appears",
      bonds:          "VERY HIGH — gym renovations, tracks, and athletic fields are common bond projects",
      leadership:     "MEDIUM — new athletic directors and facilities directors evaluate vendors",
    },
    intents: [
      {
        name:        "Athletic facility in bond project scope",
        description: "Bond measures with athletic components = gym floors, bleachers, scoreboards, and fields",
        icon: "💰", color: "#22c55e", weight: 10,
        keywords: [
          { kw: "gymnasium renovation",            w: 10 },
          { kw: "athletic facility bond",          w: 10 },
          { kw: "gym floor replacement",           w: 10 },
          { kw: "sports complex bond",             w: 10 },
          { kw: "athletic field renovation",       w: 9  },
          { kw: "track replacement",               w: 9  },
          { kw: "stadium renovation",              w: 9  },
          { kw: "bleacher replacement",            w: 9  },
          { kw: "locker room renovation",          w: 9  },
        ]
      },
      {
        name:        "PE equipment replacement or program expansion",
        description: "Annual PE budgets and program expansions drive recurring equipment purchasing",
        icon: "⚽", color: "#6366f1", weight: 8,
        keywords: [
          { kw: "pe equipment",                    w: 9  },
          { kw: "physical education equipment",    w: 9  },
          { kw: "fitness equipment",               w: 8, context: "school"   },
          { kw: "weight room equipment",           w: 9  },
          { kw: "sports equipment budget",         w: 9  },
          { kw: "new pe program",                  w: 8  },
          { kw: "adaptive pe",                     w: 8  },
          { kw: "pe curriculum",                   w: 7  },
        ]
      },
      {
        name:        "Scoreboard or timing system aged or failing",
        description: "Scoreboards tied to facility age — gyms 20+ years old are almost always in replacement window",
        icon: "📺", color: "#ef4444", weight: 8,
        keywords: [
          { kw: "scoreboard replacement",          w: 10 },
          { kw: "scoreboard upgrade",              w: 9  },
          { kw: "video scoreboard",                w: 9  },
          { kw: "led scoreboard",                  w: 9  },
          { kw: "timing system",                   w: 8, context: "athletics" },
          { kw: "shot clock",                      w: 8  },
          { kw: "swimming timing system",          w: 9  },
        ]
      },
      {
        name:        "New school construction with athletic scope",
        description: "New schools spec new gyms, fields, and PE facilities — get in during design",
        icon: "🏗️", color: "#f97316", weight: 9,
        keywords: [
          { kw: "new gymnasium",                   w: 10 },
          { kw: "new athletic facility",           w: 10 },
          { kw: "multipurpose facility",           w: 8, context: "school"   },
          { kw: "new school construction",         w: 7  },
          { kw: "athletic complex",                w: 9  },
          { kw: "new track",                       w: 9  },
          { kw: "new pool",                        w: 8, context: "school"   },
          { kw: "synthetic turf",                  w: 9  },
        ]
      },
      {
        name:        "Safety or ADA compliance issue in athletic facilities",
        description: "Aging bleachers, floors, and surfaces create liability and trigger mandatory replacement",
        icon: "⚖️", color: "#eab308", weight: 8,
        keywords: [
          { kw: "bleacher safety inspection",      w: 9  },
          { kw: "gym floor safety",                w: 9  },
          { kw: "ada athletic",                    w: 8  },
          { kw: "accessible gym",                  w: 8  },
          { kw: "fall protection",                 w: 7, context: "athletics" },
          { kw: "surface replacement",             w: 8, context: "athletic" },
          { kw: "playground safety audit",         w: 8  },
          { kw: "track resurfacing",               w: 9  },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  fine_arts_music: {
    name:    "Fine Arts & Music",
    tagline: "Instruments, band/orchestra equipment, theater, art supplies",
    icon:    "🎵",
    color:   "#ec4899",
    who:     "Musical instrument dealers, band/orchestra supply companies, theater equipment vendors, art supply distributors",
    dataSourceEmphasis: {
      board_meetings: "HIGH — fine arts program cuts or expansions are board-level decisions",
      lcap:           "HIGH — VAPA (Visual & Performing Arts) goals appear explicitly in California LCAPs",
      bonds:          "HIGH — performing arts centers, music rooms, and auditoriums are common bond projects",
      leadership:     "MEDIUM — new principals and curriculum directors drive fine arts priority shifts",
    },
    intents: [
      {
        name:        "Instrument replacement or music program investment",
        description: "Instruments have a 10–20 year lifespan; aging inventory creates recurring replacement cycles",
        icon: "🎸", color: "#ec4899", weight: 9,
        keywords: [
          { kw: "instrument replacement",          w: 10 },
          { kw: "band instruments",                w: 9  },
          { kw: "orchestra equipment",             w: 9  },
          { kw: "instrument purchase",             w: 9  },
          { kw: "music program budget",            w: 9  },
          { kw: "musical instruments",             w: 8, context: "school"   },
          { kw: "instrument inventory",            w: 8  },
          { kw: "band program expansion",          w: 9  },
        ]
      },
      {
        name:        "Performing arts facility renovation or construction",
        description: "Auditorium, black box theater, and music room renovations drive equipment packages",
        icon: "🎭", color: "#6366f1", weight: 10,
        keywords: [
          { kw: "auditorium renovation",           w: 10 },
          { kw: "performing arts center",          w: 10 },
          { kw: "theater renovation",              w: 10 },
          { kw: "music room renovation",           w: 10 },
          { kw: "black box theater",               w: 9  },
          { kw: "stage lighting",                  w: 8  },
          { kw: "sound system auditorium",         w: 9  },
          { kw: "choir room",                      w: 8  },
          { kw: "band room renovation",            w: 9  },
        ]
      },
      {
        name:        "VAPA or fine arts goal in LCAP or strategic plan",
        description: "Explicit VAPA goals signal district-level commitment and allocated budget",
        icon: "🎨", color: "#f97316", weight: 8,
        keywords: [
          { kw: "vapa goal",                       w: 10 },
          { kw: "visual performing arts",          w: 9  },
          { kw: "fine arts allocation",            w: 9  },
          { kw: "arts education goal",             w: 8  },
          { kw: "arts integration",                w: 7  },
          { kw: "arts budget",                     w: 8  },
          { kw: "arts program expansion",          w: 8  },
          { kw: "music education priority",        w: 8  },
        ]
      },
      {
        name:        "Fine arts grant or arts funding approved",
        description: "Arts-specific grants create dedicated, time-limited purchasing windows",
        icon: "💰", color: "#22c55e", weight: 9,
        keywords: [
          { kw: "arts grant",                      w: 10 },
          { kw: "nea grant",                       w: 9  },
          { kw: "title iv arts",                   w: 9  },
          { kw: "music grant",                     w: 9  },
          { kw: "arts endowment",                  w: 8  },
          { kw: "creative schools grant",          w: 9  },
          { kw: "fine arts funding",               w: 9  },
          { kw: "foundation arts grant",           w: 8  },
        ]
      },
      {
        name:        "Fine arts program restored after cuts",
        description: "Programs restored after budget cuts need full re-equipment — pent-up demand",
        icon: "🔄", color: "#eab308", weight: 8,
        keywords: [
          { kw: "arts program restored",           w: 10 },
          { kw: "music program reinstated",        w: 10 },
          { kw: "bring back arts",                 w: 9  },
          { kw: "restoring fine arts",             w: 9  },
          { kw: "arts program cut",                w: 8  },
          { kw: "music teacher hired",             w: 7  },
          { kw: "new music director",              w: 7  },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  library_media: {
    name:    "Library & Media",
    tagline: "Books, library furniture, media centers, digital resources",
    icon:    "📖",
    color:   "#0891b2",
    who:     "Book distributors, library furniture companies, digital database vendors, makerspace library suppliers",
    dataSourceEmphasis: {
      board_meetings: "MEDIUM — library budgets appear but rarely dominate board agendas",
      lcap:           "HIGH — literacy goals in LCAP frequently reference library resources",
      bonds:          "HIGH — library modernization and media center renovations are common bond projects",
      leadership:     "MEDIUM — new principals and curriculum directors drive library investment",
    },
    intents: [
      {
        name:        "Library renovation or media center modernization",
        description: "Renovated libraries need complete refresh of furniture, shelving, and equipment",
        icon: "🏗️", color: "#0891b2", weight: 10,
        keywords: [
          { kw: "library renovation",              w: 10 },
          { kw: "media center renovation",         w: 10 },
          { kw: "library modernization",           w: 10 },
          { kw: "new library",                     w: 9, context: "school"   },
          { kw: "learning commons",                w: 9  },
          { kw: "library furniture",               w: 9  },
          { kw: "library expansion",               w: 8  },
          { kw: "reading center renovation",       w: 8  },
        ]
      },
      {
        name:        "Literacy or reading intervention goal",
        description: "Literacy goals drive book collection investment, reading software, and decodable text purchases",
        icon: "📚", color: "#22c55e", weight: 9,
        keywords: [
          { kw: "literacy goal",                   w: 9  },
          { kw: "reading intervention",            w: 9  },
          { kw: "science of reading",              w: 9  },
          { kw: "decodable readers",               w: 9  },
          { kw: "reading program",                 w: 8, context: "lcap"     },
          { kw: "early literacy",                  w: 8  },
          { kw: "book collection",                 w: 8  },
          { kw: "independent reading",             w: 7  },
          { kw: "diverse books",                   w: 7  },
        ]
      },
      {
        name:        "Digital library or database subscription",
        description: "Districts consolidating physical and digital resources create platform purchasing decisions",
        icon: "💻", color: "#8b5cf6", weight: 8,
        keywords: [
          { kw: "digital library",                 w: 9  },
          { kw: "ebook subscription",              w: 9  },
          { kw: "database subscription",           w: 8, context: "library"  },
          { kw: "overdrive",                       w: 8  },
          { kw: "sora",                            w: 8  },
          { kw: "digital resources library",       w: 8  },
          { kw: "online library platform",         w: 8  },
          { kw: "research databases",              w: 7  },
        ]
      },
      {
        name:        "Library technology or maker space addition",
        description: "Modern library programs add 3D printers, recording studios, and makerspaces",
        icon: "🔧", color: "#f97316", weight: 7,
        keywords: [
          { kw: "library makerspace",              w: 9  },
          { kw: "library innovation",              w: 8  },
          { kw: "library technology",              w: 8  },
          { kw: "media production",                w: 7, context: "school"   },
          { kw: "podcast studio school",           w: 8  },
          { kw: "green screen",                    w: 7, context: "school"   },
          { kw: "library 3d printing",             w: 8  },
        ]
      },
      {
        name:        "Book collection diversity or curriculum adoption",
        description: "Curriculum adoptions and diversity initiatives trigger large-scale book purchases",
        icon: "🌍", color: "#eab308", weight: 7,
        keywords: [
          { kw: "curriculum adoption",             w: 9  },
          { kw: "new curriculum materials",        w: 8  },
          { kw: "diverse library collection",      w: 8  },
          { kw: "banned book",                     w: 7  },
          { kw: "book challenge",                  w: 7  },
          { kw: "textbook replacement",            w: 8  },
          { kw: "instructional materials adoption", w: 9 },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  mental_health_wellness: {
    name:    "Mental Health & Wellness",
    tagline: "Counseling programs, SEL curriculum, wellness room design",
    icon:    "💚",
    color:   "#059669",
    who:     "Mental health staffing agencies, SEL curriculum publishers, wellness room furniture vendors, telehealth platforms, MTSS software",
    dataSourceEmphasis: {
      board_meetings: "HIGH — mental health crises, staffing shortages, and wellness initiatives are frequent board topics",
      lcap:           "VERY HIGH — student support and wellness goals are now standard in every LCAP",
      bonds:          "MEDIUM — wellness rooms and counseling spaces occasionally appear in bond scopes",
      leadership:     "HIGH — new superintendents with equity or student wellness agendas are ideal customers",
    },
    intents: [
      {
        name:        "Mental health funding approved — state or federal",
        description: "Dedicated mental health grants create fast, targeted spending windows",
        icon: "💰", color: "#22c55e", weight: 10,
        keywords: [
          { kw: "mental health grant",             w: 10 },
          { kw: "mhsa funding",                    w: 10 },
          { kw: "student wellness grant",          w: 9  },
          { kw: "esser mental health",             w: 10 },
          { kw: "cal aims",                        w: 9  },
          { kw: "mental health budget",            w: 9  },
          { kw: "wellness funding",                w: 9  },
          { kw: "counseling grant",                w: 9  },
        ]
      },
      {
        name:        "Counselor or mental health staffing shortage",
        description: "Reported shortages trigger emergency hiring and contract services — staffing agencies and telehealth platforms",
        icon: "👥", color: "#ef4444", weight: 9,
        keywords: [
          { kw: "counselor shortage",              w: 10 },
          { kw: "mental health staffing",          w: 9  },
          { kw: "school psychologist shortage",    w: 10 },
          { kw: "counselor ratio",                 w: 9  },
          { kw: "social worker",                   w: 7, context: "school"   },
          { kw: "telehealth counseling",           w: 9  },
          { kw: "virtual mental health",           w: 8  },
          { kw: "mental health provider",          w: 8, context: "school"   },
        ]
      },
      {
        name:        "SEL or student wellness goal in LCAP",
        description: "LCAP wellness goals signal approved budget and procurement authority",
        icon: "📋", color: "#6366f1", weight: 8,
        keywords: [
          { kw: "social emotional learning",       w: 9  },
          { kw: "sel program",                     w: 9  },
          { kw: "student wellness goal",           w: 9  },
          { kw: "mtss",                            w: 8  },
          { kw: "tiered support",                  w: 8  },
          { kw: "positive behavior support",       w: 8  },
          { kw: "pbis",                            w: 8  },
          { kw: "restorative practices",           w: 7  },
          { kw: "trauma-informed",                 w: 8  },
        ]
      },
      {
        name:        "Wellness room or calming space creation",
        description: "Wellness rooms require specialized furniture, sensory equipment, and design — emerging procurement category",
        icon: "🏠", color: "#f97316", weight: 8,
        keywords: [
          { kw: "wellness room",                   w: 10 },
          { kw: "calming room",                    w: 10 },
          { kw: "sensory room",                    w: 9  },
          { kw: "mindfulness space",               w: 9  },
          { kw: "quiet room",                      w: 8, context: "school"   },
          { kw: "de-escalation room",              w: 9  },
          { kw: "wellness center",                 w: 8, context: "school"   },
          { kw: "counseling suite",                w: 8  },
        ]
      },
      {
        name:        "Student mental health crisis — district response",
        description: "Publicized crises (self-harm, suicide, violence) trigger immediate program and staffing investment",
        icon: "🚨", color: "#8b5cf6", weight: 9,
        keywords: [
          { kw: "student mental health crisis",    w: 10 },
          { kw: "suicide prevention",              w: 10 },
          { kw: "mental health emergency",         w: 9  },
          { kw: "student wellness crisis",         w: 9  },
          { kw: "anxiety depression students",     w: 8  },
          { kw: "mental health task force",        w: 9  },
          { kw: "student support team",            w: 8  },
          { kw: "crisis intervention",             w: 8, context: "school"   },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  life_safety_fire: {
    name:    "Life Safety & Fire Systems",
    tagline: "Fire alarm, sprinklers, emergency lighting, code compliance",
    icon:    "🔥",
    color:   "#dc2626",
    who:     "Time & Alarm, Simplex, Notifier, Honeywell Fire, fire contractors",
    dataSourceEmphasis: {
      bonds:          "HIGH — life safety is often a mandated bond component",
      board_meetings: "HIGH — fire inspection deficiencies surface in board reports",
      lcap:           "LOW",
      leadership:     "MEDIUM — new facilities directors run safety audits",
    },
    intents: [
      {
        name:        "Fire alarm system is aging or failed inspection",
        description: "DSA/fire marshal deficiency = non-discretionary replacement",
        icon: "🚒", color: "#dc2626", weight: 10,
        keywords: [
          { kw: "fire alarm replacement",       w: 10 },
          { kw: "fire alarm upgrade",           w: 10 },
          { kw: "fire alarm system",            w: 8  },
          { kw: "fire panel replacement",       w: 10 },
          { kw: "FACP replacement",             w: 10 },
          { kw: "fire inspection deficiency",   w: 10 },
          { kw: "fire code compliance",         w: 9  },
          { kw: "smoke detector replacement",   w: 9  },
        ]
      },
      {
        name:        "Life safety bond or funding approved",
        description: "Dedicated life safety bond = direct procurement path, often mandated by law",
        icon: "💰", color: "#22c55e", weight: 10,
        keywords: [
          { kw: "life safety bond",             w: 10 },
          { kw: "life safety systems",          w: 9  },
          { kw: "fire suppression system",      w: 9  },
          { kw: "sprinkler installation",       w: 9  },
          { kw: "sprinkler retrofit",           w: 9  },
          { kw: "health and safety bond",       w: 8  },
          { kw: "emergency systems",            w: 7  },
          { kw: "NFPA 72",                      w: 8  },
          { kw: "NFPA 101",                     w: 8  },
        ]
      },
      {
        name:        "New construction or major renovation",
        description: "All new and renovated buildings require fire system integration",
        icon: "🏗️", color: "#6366f1", weight: 8,
        keywords: [
          { kw: "new school construction",      w: 8  },
          { kw: "DSA submittal",                w: 9  },
          { kw: "division of state architect",  w: 8  },
          { kw: "building permit issued",       w: 7  },
          { kw: "modernization project",        w: 7  },
          { kw: "major renovation",             w: 7  },
          { kw: "seismic retrofit",             w: 6  },
        ]
      },
      {
        name:        "Code compliance or state mandate",
        description: "Regulatory pressure creates non-discretionary purchasing timelines",
        icon: "⚖️", color: "#f97316", weight: 9,
        keywords: [
          { kw: "code compliance upgrade",      w: 9  },
          { kw: "building code compliance",     w: 9  },
          { kw: "asbestos abatement",           w: 7  },
          { kw: "hazardous materials removal",  w: 7  },
          { kw: "emergency lighting replacement", w: 8 },
          { kw: "exit sign replacement",        w: 7  },
          { kw: "DSA fire safety",              w: 9  },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  boostlingo_ell: {
    name:    "ELL / Language Access",
    tagline: "Interpretation, translation, ELL programs, IEP language support",
    icon:    "🌎",
    color:   "#0ea5e9",
    who:     "Boostlingo, Language Line, interpreter agencies, ELL curriculum vendors",
    dataSourceEmphasis: {
      board_meetings: "HIGH — ELL program expansions and OCR complaints surface in board minutes",
      lcap:           "HIGH — California LCAP requires EL reporting and goal-setting",
      bonds:          "LOW",
      leadership:     "MEDIUM — new directors of ELL or multilingual programs",
    },
    intents: [
      {
        name:        "Growing ELL population requiring more language services",
        description: "ELL enrollment growth = direct demand for interpretation and translation",
        icon: "📈", color: "#0ea5e9", weight: 10,
        keywords: [
          { kw: "english language learner",     w: 10 },
          { kw: "ELL student",                  w: 10 },
          { kw: "ELL enrollment growth",        w: 10 },
          { kw: "English learner program",      w: 9  },
          { kw: "newcomer program",             w: 9  },
          { kw: "newcomer student",             w: 9  },
          { kw: "migrant education",            w: 8  },
          { kw: "dual language program",        w: 8  },
        ]
      },
      {
        name:        "IEP or family meetings needing interpretation",
        description: "Every district with ELL students needs interpretation for IEP meetings — it's a legal requirement",
        icon: "⚖️", color: "#f97316", weight: 10,
        keywords: [
          { kw: "IEP interpreter",              w: 10 },
          { kw: "IEP translation",              w: 10 },
          { kw: "parent interpreter",           w: 9  },
          { kw: "interpretation services",      w: 9  },
          { kw: "interpreter services",         w: 9  },
          { kw: "language access plan",         w: 10 },
          { kw: "OCR language access",          w: 10 },
          { kw: "language barrier",             w: 8  },
        ]
      },
      {
        name:        "Title III funding available",
        description: "Title III is the dedicated federal funding stream for ELL programs",
        icon: "💰", color: "#22c55e", weight: 9,
        keywords: [
          { kw: "Title III",                    w: 9  },
          { kw: "Title III grant",              w: 10 },
          { kw: "Title III program",            w: 9  },
          { kw: "bilingual education",          w: 7  },
          { kw: "LCAP EL goal",                 w: 8  },
          { kw: "LCAP english learner",         w: 8  },
          { kw: "reclassification rate",        w: 7  },
          { kw: "long-term english learner",    w: 8  },
        ]
      },
      {
        name:        "New multilingual or ELL program director",
        description: "New ELL leadership resets service vendor relationships",
        icon: "👤", color: "#8b5cf6", weight: 7,
        keywords: [
          { kw: "director of ELL",              w: 8  },
          { kw: "multilingual programs director", w: 8 },
          { kw: "coordinator of english learners", w: 7 },
          { kw: "ESL coordinator",              w: 7  },
          { kw: "bilingual program director",   w: 7  },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  new_construction_preconstruction: {
    name:    "New Construction & Pre-Construction",
    tagline: "New school sites, DSA submittals, geotechnical, environmental, architecture",
    icon:    "🏛️",
    color:   "#78716c",
    who:     "Thompson Engineering, geotechnical firms, architects, civil engineers, surveyors",
    dataSourceEmphasis: {
      bonds:          "HIGH — new construction bonds are the primary trigger",
      board_meetings: "HIGH — site selection and RFQs appear in board agendas",
      lcap:           "LOW",
      leadership:     "MEDIUM — new facilities directors drive new school planning",
    },
    intents: [
      {
        name:        "New school bond passed — new construction authorized",
        description: "Bond with new school language is the primary trigger for geotechnical and pre-construction services",
        icon: "🏛️", color: "#22c55e", weight: 10,
        keywords: [
          { kw: "new school construction",      w: 10 },
          { kw: "new school site",              w: 10 },
          { kw: "school site acquisition",      w: 10 },
          { kw: "new elementary school",        w: 10 },
          { kw: "new middle school",            w: 10 },
          { kw: "new high school",              w: 10 },
          { kw: "replacement school",           w: 9  },
          { kw: "new campus",                   w: 9  },
          { kw: "bond new school",              w: 9  },
        ]
      },
      {
        name:        "RFQ or RFP for pre-construction services",
        description: "Active procurement — respond immediately",
        icon: "📄", color: "#ef4444", weight: 10,
        keywords: [
          { kw: "RFQ geotechnical",             w: 10 },
          { kw: "geotechnical investigation",   w: 10 },
          { kw: "soil investigation",           w: 10 },
          { kw: "soils report",                 w: 10 },
          { kw: "Phase 1 environmental",        w: 9  },
          { kw: "Phase 2 environmental",        w: 9  },
          { kw: "environmental site assessment", w: 9 },
          { kw: "RFQ architect",                w: 9  },
          { kw: "design-build RFP",             w: 9  },
          { kw: "CMAR",                         w: 8  },
        ]
      },
      {
        name:        "DSA or CEQA process initiated",
        description: "Regulatory filings signal imminent construction work",
        icon: "✅", color: "#6366f1", weight: 9,
        keywords: [
          { kw: "DSA submittal",                w: 10 },
          { kw: "division of state architect",  w: 9  },
          { kw: "DSA approval",                 w: 10 },
          { kw: "DSA application",              w: 9  },
          { kw: "CEQA",                         w: 9  },
          { kw: "environmental impact report",  w: 9  },
          { kw: "program EIR",                  w: 8  },
          { kw: "groundbreaking",               w: 8  },
        ]
      },
      {
        name:        "Facilities master plan or enrollment growth study",
        description: "Planning documents precede construction by 12-24 months — get in early",
        icon: "📐", color: "#f97316", weight: 7,
        keywords: [
          { kw: "facilities master plan",       w: 8  },
          { kw: "long-range facilities plan",   w: 8  },
          { kw: "enrollment growth",            w: 7  },
          { kw: "overcrowding relief",          w: 7  },
          { kw: "portable classroom replacement", w: 7 },
          { kw: "needs assessment facilities",  w: 7  },
          { kw: "property acquisition",         w: 7  },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  newsletter_intelligence: {
    name:    "District Intelligence & Newsletter",
    tagline: "Leadership changes, board shifts, budget events, enrollment trends",
    icon:    "📰",
    color:   "#64748b",
    who:     "K-12 industry newsletter subscribers, investors, consultants, policy researchers",
    dataSourceEmphasis: {
      board_meetings: "CRITICAL — all leadership changes and budget decisions surface here",
      lcap:           "HIGH — strategic priorities and budget allocation",
      bonds:          "HIGH — bond elections are major newsworthy events",
      leadership:     "CRITICAL — the primary source",
    },
    intents: [
      {
        name:        "Superintendent or major leadership change",
        description: "The single highest-value intelligence signal — resets all vendor relationships",
        icon: "👤", color: "#ef4444", weight: 10,
        keywords: [
          { kw: "superintendent appointed",     w: 10 },
          { kw: "superintendent resigned",      w: 10 },
          { kw: "superintendent has resigned",  w: 10 },
          { kw: "superintendent retiring",      w: 10 },
          { kw: "superintendent fired",         w: 10 },
          { kw: "superintendent terminated",    w: 10 },
          { kw: "superintendent search",        w: 9  },
          { kw: "interim superintendent",       w: 9  },
          { kw: "national superintendent search", w: 10 },
          { kw: "new superintendent",           w: 9  },
        ]
      },
      {
        name:        "Board election or major governance shift",
        description: "Board majority change = policy and vendor relationship reset",
        icon: "🗳️", color: "#6366f1", weight: 9,
        keywords: [
          { kw: "board election",               w: 9  },
          { kw: "new board member",             w: 8  },
          { kw: "board majority",               w: 9  },
          { kw: "board recall",                 w: 10 },
          { kw: "board vacancy",                w: 8  },
          { kw: "special board meeting",        w: 7  },
          { kw: "emergency board meeting",      w: 8  },
        ]
      },
      {
        name:        "Budget crisis, deficit, or layoffs",
        description: "Budget events signal purchasing freezes or urgent realignment",
        icon: "💸", color: "#f97316", weight: 9,
        keywords: [
          { kw: "budget deficit",               w: 10 },
          { kw: "budget shortfall",             w: 10 },
          { kw: "mid-year budget cut",          w: 10 },
          { kw: "reduction in force",           w: 9  },
          { kw: "teacher layoffs",              w: 9  },
          { kw: "RIF",                          w: 8  },
          { kw: "reserve draw",                 w: 8  },
          { kw: "state takeover",               w: 10 },
          { kw: "accreditation warning",        w: 9  },
        ]
      },
      {
        name:        "Enrollment decline or school closure",
        description: "Enrollment shifts fundamentally change district purchasing power and priorities",
        icon: "📉", color: "#8b5cf6", weight: 8,
        keywords: [
          { kw: "enrollment decline",           w: 9  },
          { kw: "school closure",               w: 10 },
          { kw: "school consolidation",         w: 9  },
          { kw: "school merger",                w: 9  },
          { kw: "enrollment growth",            w: 8  },
          { kw: "new school opening",           w: 8  },
          { kw: "boundary change",              w: 7  },
          { kw: "redistricting",                w: 7  },
        ]
      },
      {
        name:        "Bond election result",
        description: "Pass or fail — both are newsworthy and signal future district direction",
        icon: "🏛️", color: "#22c55e", weight: 9,
        keywords: [
          { kw: "bond measure passed",          w: 10 },
          { kw: "bond measure approved",        w: 10 },
          { kw: "bond measure failed",          w: 9  },
          { kw: "bond measure rejected",        w: 9  },
          { kw: "voters approved bond",         w: 10 },
          { kw: "bond election results",        w: 9  },
          { kw: "measure passed",               w: 8  },
          { kw: "LCAP adopted",                 w: 7  },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  transportation_fleet: {
    name:    "Transportation & Fleet",
    tagline: "School bus replacement, EV buses, GPS tracking, routing software",
    icon:    "🚌",
    color:   "#f59e0b",
    who:     "Blue Bird, IC Bus, Thomas Built, Zonar, Tyler Technologies (routing)",
    dataSourceEmphasis: {
      bonds:          "MEDIUM — buses sometimes included in bond projects",
      board_meetings: "HIGH — fleet replacement plans appear in board agendas",
      lcap:           "MEDIUM",
      leadership:     "LOW",
    },
    intents: [
      {
        name:        "EPA Clean School Bus funding available",
        description: "$5B federal program for electric/clean bus replacement — districts actively applying",
        icon: "💰", color: "#22c55e", weight: 10,
        keywords: [
          { kw: "EPA clean school bus",         w: 10 },
          { kw: "electric school bus",          w: 10 },
          { kw: "EV school bus",                w: 10 },
          { kw: "zero emission bus",            w: 10 },
          { kw: "clean school bus program",     w: 10 },
          { kw: "EPA bus rebate",               w: 9  },
          { kw: "IRA clean vehicle",            w: 8  },
        ]
      },
      {
        name:        "Bus fleet replacement or modernization",
        description: "Aging fleet or safety concerns drive scheduled replacement cycles",
        icon: "🚌", color: "#f59e0b", weight: 9,
        keywords: [
          { kw: "school bus replacement",       w: 10 },
          { kw: "bus fleet replacement",        w: 10 },
          { kw: "fleet modernization",          w: 8  },
          { kw: "bus fleet",                    w: 7  },
          { kw: "aging bus fleet",              w: 9  },
          { kw: "new buses",                    w: 7  },
          { kw: "bus procurement",              w: 8  },
        ]
      },
      {
        name:        "GPS tracking or routing software upgrade",
        description: "Technology modernization for fleet management and student safety tracking",
        icon: "📡", color: "#6366f1", weight: 7,
        keywords: [
          { kw: "GPS bus tracking",             w: 9  },
          { kw: "bus routing software",         w: 9  },
          { kw: "transportation management system", w: 8 },
          { kw: "student tracking transportation", w: 8 },
          { kw: "fleet management school",      w: 8  },
          { kw: "bus driver shortage",          w: 7  },
          { kw: "ridership decline",            w: 6  },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  food_nutrition: {
    name:    "Food Service & Nutrition",
    tagline: "Cafeteria renovation, kitchen equipment, meal programs, POS systems",
    icon:    "🍽️",
    color:   "#84cc16",
    who:     "Hobart, Manitowoc, Welbilt (kitchen equipment), Titan School Solutions (POS), food service management",
    dataSourceEmphasis: {
      bonds:          "HIGH — cafeteria/kitchen renovation is a common bond line item",
      board_meetings: "HIGH — kitchen equipment failures and meal program changes",
      lcap:           "LOW",
      leadership:     "LOW",
    },
    intents: [
      {
        name:        "Kitchen or cafeteria renovation in bond",
        description: "Bond-funded kitchen renovation = full equipment procurement cycle",
        icon: "🏗️", color: "#22c55e", weight: 10,
        keywords: [
          { kw: "cafeteria renovation",         w: 10 },
          { kw: "kitchen renovation",           w: 10 },
          { kw: "cafeteria upgrade",            w: 9  },
          { kw: "kitchen equipment replacement", w: 10 },
          { kw: "commercial kitchen equipment", w: 9  },
          { kw: "food service equipment",       w: 9  },
          { kw: "kitchen hood replacement",     w: 8  },
          { kw: "dishwasher replacement school", w: 8 },
        ]
      },
      {
        name:        "Meal program expansion or universal meals",
        description: "Expanded meal programs require new equipment, POS, and management systems",
        icon: "🍎", color: "#84cc16", weight: 8,
        keywords: [
          { kw: "universal free meals",         w: 9  },
          { kw: "universal breakfast",          w: 8  },
          { kw: "meal program expansion",       w: 8  },
          { kw: "free and reduced meal",        w: 7  },
          { kw: "after-school meal program",    w: 7  },
          { kw: "USDA equipment grant",         w: 9  },
          { kw: "nutrition management software", w: 8 },
        ]
      },
      {
        name:        "Point-of-sale or food service software upgrade",
        description: "POS system replacement or new nutrition management software procurement",
        icon: "💻", color: "#6366f1", weight: 7,
        keywords: [
          { kw: "point of sale food service",   w: 9  },
          { kw: "POS cafeteria",                w: 9  },
          { kw: "food service management system", w: 8 },
          { kw: "Titan school solutions",       w: 9  },
          { kw: "cafeteria POS replacement",    w: 8  },
          { kw: "food service software",        w: 7  },
        ]
      },
    ]
  },

};

// ── Helper: get all vertical keys sorted by name ───────────────────────────
function getVerticalKeys() {
  return Object.keys(VERTICALS).sort((a,b) =>
    VERTICALS[a].name.localeCompare(VERTICALS[b].name)
  );
}

// ── Helper: build intent objects from a vertical template ─────────────────
function buildIntentsFromVertical(verticalKey) {
  const v = VERTICALS[verticalKey];
  if (!v) return [];
  return v.intents.map((t, i) => ({
    id:          'intent_' + Date.now() + '_' + i,
    name:        t.name,
    description: t.description || '',
    icon:        t.icon || '🎯',
    color:       t.color || '#6366f1',
    weight:      t.weight || 5,
    collapsed:   i > 0,
    keywords:    (t.keywords || []).map(k => ({
      id:      'kw_' + Math.random().toString(36).slice(2),
      text:    k.kw,
      weight:  k.w,
      context: k.context || '',
      sources: { youtube: true, lcap: true, bonds: true, news: true },
      matches: 0,
      useful:  0,
      noise:   0,
    }))
  }));
}

// ── Helper: count total keywords in a vertical ────────────────────────────
function countKeywords(verticalKey) {
  const v = VERTICALS[verticalKey];
  if (!v) return 0;
  return v.intents.reduce((sum, i) => sum + (i.keywords || []).length, 0);
}

// Export for Node/module environments
if (typeof module !== 'undefined') module.exports = { VERTICALS, getVerticalKeys, buildIntentsFromVertical, countKeywords };
