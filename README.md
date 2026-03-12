<p align="center">
  <img src="docs/assets/echelon-banner.png" alt="Echelon Banner" width="600" />
</p>

<h1 align="center">Echelon</h1>

<p align="center">
  <strong>Tinder for Scholarships; Swipe. Apply. Fund Your Future.</strong>
</p>

<p align="center">
  <a href="#getting-started"><img src="https://img.shields.io/badge/status-hackathon_mvp-blueviolet?style=for-the-badge" alt="Status" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/frontend-Next.js-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/backend-FastAPI-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/AI-Gemini%20%2F%20OpenAI-FF6F00?style=for-the-badge" alt="AI" /></a>
</p>

---

## The Problem

Every year, **over $20 million** in scholarship funds go unclaimed. The distribution system is broken on both sides:

| Pain Point | Students | Providers |
|---|---|---|
| **Discovery** | Thousands of fragmented web portals, no central source of truth | Qualified candidates never find their listings |
| **Effort** | Hours wasted applying to hyper-competitive scholarships they won't win | Expensive marketing to reach the right audience |
| **Outcome** | Missed niche, low-competition funds with high win rates | Unawarded capital sitting idle |

## The Solution

**Echelon** is an AI-powered scholarship matching platform that parses your entire academic profile, calculates your **win probability** for every opportunity, and routes you toward the **highest-ROI applications**, all through an intuitive swipe interface.

> Less guesswork for students. Zero wasted capital for funders. The right grants finally meet the right people.

### How It Works

```
    ┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
    │   PROFILE        │       │   AI MATCHING    │       │   SWIPE          │       │   TRACK          │
    │   INGESTION      │       │   ENGINE         │       │   DISCOVERY      │       │   & APPLY        │
    │                  │       │                  │       │                  │       │                  │
    │  Upload docs,    │       │  Win probability,│       │  Right → Save    │       │  Kanban board:   │
    │  parse profile,  │ ───▶  │  effort threads, │ ───▶  │  Left  → Skip    │ ───▶  │  Saved → Won     │
    │  verify data     │       │  game-theory     │       │  One card at     │       │  One-click apply │
    │                  │       │  optimization    │       │  a time          │       │                  │
    └──────────────────┘       └──────────────────┘       └──────────────────┘       └──────────────────┘
```

---

## Core Features (MVP)

### Onboarding & AI Profiling
- **Guided Survey:** 10-20 minute onboarding flow with a friendly mascot guide (think Duo from Duolingo) that builds your complete profile
- **Document Parsing:** Upload transcripts, resumes, and essays; AI extracts demographics, GPA, achievements, and extracurriculars automatically
- **Manual Verification:** Review and edit every parsed field before your profile goes live
- **Identity & Institution Verification:** Verified students unlock university-sanctioned scholarships, grants, and contests

### AI Matching & Optimization Engine
- **Win Probability Score:** Every scholarship displays a statistical likelihood of winning based on historical data, competition volume, and your profile strength
- **Effort-Thread Modeling:** Your available time and energy are modeled as "computational threads," optimized so you spend hours where they matter most
- **Game-Theoretic Routing:** The engine builds a *portfolio* of applications: least effort to highest probable return, actively steering you toward unclaimed and low-competition funds

### Swipe Discovery
- **One-Card-at-a-Time UI:** Fluid, mobile-first swipe interface powered by Framer Motion
- **Swipe Right** → Save / Apply &nbsp;|&nbsp; **Swipe Left** → Discard
- **One-Click Apply:** For supported providers, stored profile data and parsed essays auto-populate the application (simulated in MVP)

### Application Tracker
- **Kanban Pipeline:** Drag-and-drop board with lanes: `Saved → Applied → In Review → Round 1 → Round 2 → Won → Lost`
- **Deadline Notifications:** Upcoming deadline alerts and future application reminders
- **Winner Advice:** For recurring large scholarships, surface tips and advice from previous winners

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js, React, Framer Motion, Tailwind CSS | Mobile-first web app with swipe gestures & Kanban UI |
| **Backend** | Python, FastAPI | REST API, document parsing, LLM orchestration |
| **AI / ML** | Gemini / OpenAI APIs | Profile extraction, NLP, recommendation signals |
| **Matching Engine** | Python (NumPy, SciPy) | Win-probability calculation, game-theoretic scheduling |
| **Database** | PostgreSQL | User profiles, scholarship inventory, application state |
| **Auth** | NextAuth.js / OAuth | Student identity & institution verification |

### Architecture Diagram

```
                    ┌───────────────────────────────────┐
                    │        Next.js Frontend           │
                    │   Swipe UI · Kanban · Profile     │
                    └────────────────┬──────────────────┘
                                     │ REST / WebSocket
                    ┌────────────────▼──────────────────┐
                    │         FastAPI Backend           │
                    │   Auth · Profile · Applications   │
                    └───────┬───────────────────┬───────┘
                            │                   │
                ┌───────────▼───────┐ ┌─────────▼───────────┐
                │   AI Profiling    │ │   Matching Engine   │
                │   Service         │ │   (Python)          │
                │   Gemini / OpenAI │ │   Win Prob · Threads│
                └───────────┬───────┘ │   Game Theory       │
                            │         └─────────┬───────────┘
                    ┌───────▼───────────────────▼───────┐
                    │           PostgreSQL              │
                    │   Users · Scholarships · Apps     │
                    └───────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.11
- **PostgreSQL** ≥ 15
- **pnpm** (recommended) or npm

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/echelon.git
cd echelon

# ── Frontend ──
cd frontend
pnpm install
cp .env.example .env.local   # configure API keys
pnpm dev                     # → http://localhost:3000

# ── Backend ──
cd ../backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # configure DB + LLM keys
uvicorn app.main:app --reload # → http://localhost:8000
```

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENAI_API_KEY` | OpenAI API key (or Gemini equivalent) |
| `NEXTAUTH_SECRET` | Auth session secret |
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

---

## Project Structure

```
echelon/
├── frontend/               # Next.js application
│   ├── app/                # App router pages
│   ├── components/         # Reusable UI components
│   │   ├── swipe/          # Swipe card engine
│   │   ├── kanban/         # Application tracker board
│   │   └── onboarding/     # Survey & profile wizard
│   ├── lib/                # Utilities, API client
│   └── public/             # Static assets & mascot
├── backend/                # FastAPI application
│   ├── app/
│   │   ├── api/            # Route handlers
│   │   ├── models/         # SQLAlchemy / Pydantic models
│   │   ├── services/       # Business logic
│   │   │   ├── profiling/  # AI document parsing
│   │   │   └── matching/   # Win-probability & game theory
│   │   └── core/           # Config, auth, DB session
│   └── tests/
├── docs/                   # Documentation & assets
└── README.md
```

---

## Success Metrics

| KPI | Target | Description |
|---|---|---|
| **Swipes / Session** | > 15 | Measures engagement and feed quality |
| **Application Conversion** | — | % of right-swipes → completed applications |
| **Time-to-Apply** | ↓ 50%+ | vs. traditional portal application time |
| **Dollars Discovered** | — | Total scholarship value surfaced from low-visibility pools |

---

## Roadmap

### MVP (Hackathon)
- [x] AI profile ingestion & parsing
- [x] Win-probability matching engine
- [x] Swipe discovery interface
- [x] Application tracker (Kanban)
- [x] Deadline notifications

### v1.0
- [ ] Institution verification → unlock university-specific scholarships
- [ ] Real provider integrations (auto-submit applications)
- [ ] Winner advice & community tips for recurring scholarships
- [ ] Push notifications for deadlines & status updates

### v1.5 — Matching Engine Evolution
- [ ] Migrate game-theoretic routing from Python to [Tenet](https://fawazishola.ca/tenet/), a purpose-built DSL for game theory modeling created by one of our team members, enabling compile-time validation and native Nash equilibrium solving

### v2.0 — Fintech & Expansion
- [ ] Track and deploy awarded funds directly through the platform
- [ ] Revenue-funded scholarship mandate (% of revenue → new scholarships)
- [ ] Expand to fellowships, contests, exchanges, and raffles
- [ ] Provider dashboard for charities & businesses to manage listings
- [ ] Public/private sector donation portal to create new opportunities

---

## Design & Inspiration

- **UI Mood Board:** [Pinterest Inspiration Board](https://pin.it/6EfXAyAq)
- **Mascot:** A friendly, encouraging character in the spirit of Duolingo's Duo — guiding students through onboarding and celebrating milestones
- **Design Philosophy:** Mobile-first, playful yet trustworthy, minimal friction at every step

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Echelon</strong> | Making education universally affordable, one swipe at a time.
</p>
