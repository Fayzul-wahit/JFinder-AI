# JFinder AI — Your Personal AI Career Intelligence Platform

> An AI-powered Career Operating System that bridges the gap between education and industry by guiding students and professionals toward their dream job at their dream company.

---

## What is JFinder AI?

JFinder AI is **not** a job portal. It is **not** just another course platform. It is **not** LinkedIn.

JFinder AI is an **AI Career Operating System** that continuously analyzes a user's academic profile, skills, projects, and certifications against real job market requirements — and generates a personalized, gamified roadmap to help them land their dream job at their dream company.

---

## The Problem

Millions of students graduate every year with strong theoretical knowledge but lack the practical, job-ready skills companies actually need. They struggle with:

- What should I learn, and which skills actually matter?
- Which projects and certifications are worth my time?
- Am I truly ready for placements and interviews?
- Which companies should I realistically target?

Existing platforms solve only one part of this problem. Some teach courses. Some list jobs. Some analyze resumes. **No single platform combines all of these into one personalized, AI-driven career ecosystem.**

---

## The Solution

JFinder AI combines seven AI engines into one continuously updating platform:

| Engine | What it does |
|---|---|
| Career Intelligence Engine | Analyzes company hiring trends and job requirements |
| Skill Gap Engine | Compares current skills vs required skills |
| Trend Analysis Engine | Tracks growing and declining technologies |
| Roadmap Generator | Creates a personalized, level-based learning path |
| Career Readiness Engine | Computes the Career Readiness Score (CRS) |
| Company Recommendation Engine | Suggests similar companies to target |
| AI Career Digital Twin | Predicts future readiness at 3, 6, and 12 months |

---

## Career Readiness Score (CRS)

The core metric of JFinder AI is the Career Readiness Score, calculated using:

```
CRS = (W₁ × S) + (W₂ × A) + (W₃ × P) + (W₄ × C) + (W₅ × R)
```

| Symbol | Factor | Weight |
|---|---|---|
| S | Technical Skills Match | 0.40 (40%) |
| A | Academic Performance (CGPA) | 0.10 (10%) |
| P | Project Relevance | 0.25 (25%) |
| C | Certifications | 0.15 (15%) |
| R | Resume Quality | 0.10 (10%) |

**Example:** A first-year student targeting Data Analyst at Zoho with S=40%, A=75%, P=20%, C=10%, R=50% → **CRS = 35%**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite) |
| Backend | Node.js + Express.js |
| Database | MongoDB |
| Authentication | JWT + bcrypt |
| AI Layer | External LLM APIs (OpenAI / Claude API) |
| File Storage | Cloudinary / AWS S3 |

---

## Features

- **Username + Password Authentication** (signup and login)
- **Multi-step Onboarding** (6 steps: Basic Info → Skills → Projects → Resume → Certifications → Career Goal)
- **Career Readiness Score** with per-factor breakdown and ring chart
- **Skill Gap Analysis** (matched skills vs missing skills, priority list)
- **Level-based Gamified Roadmap** (Foundation → Skill Development → Industry Ready → Placement Ready)
- **Company Intelligence** (hiring trends, required skills, salary ranges per company)
- **Job Trend Analysis** (growing/declining skills, AI impact, salary trends)
- **Smart Company Recommendations** (similar companies to the user's dream company)
- **AI Mentor Chatbot** (floating chat button, powered by LLM API)
- **AI Career Digital Twin** (3/6/12 month readiness prediction)
- **Gamification** (XP, badges, daily streaks, weekly challenges)
- **Industry News Feed** (personalized by dream job and company)
- **Dark Mode** (violet theme throughout)

---

## Project Structure

```
JFinder-AI/
├── frontend/                   # React.js web app (Vite)
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/         # Button, Card, Badge, Input, Modal
│   │   │   ├── layout/         # Navbar, Sidebar, Footer
│   │   │   └── charts/         # ReadinessChart, TrendGraph, DigitalTwin
│   │   ├── pages/
│   │   │   ├── Landing/
│   │   │   ├── Auth/
│   │   │   ├── Onboarding/
│   │   │   ├── Dashboard/
│   │   │   ├── Roadmap/
│   │   │   ├── SkillGap/
│   │   │   ├── CompanyIntel/
│   │   │   ├── JobTrends/
│   │   │   ├── Projects/
│   │   │   ├── Certifications/
│   │   │   ├── News/
│   │   │   ├── AIMentor/
│   │   │   ├── Profile/
│   │   │   └── Settings/
│   │   ├── context/            # AuthContext, UserContext
│   │   ├── hooks/              # useAuth, useUser, useCRS
│   │   ├── services/           # api.js, auth.js
│   │   ├── utils/              # crsCalculator.js
│   │   └── styles/             # global.css, theme.css
│   └── package.json
│
├── backend/                    # Node.js + Express
│   ├── config/                 # db.js
│   ├── controllers/            # Auth, User, CRS, SkillGap, Roadmap, Company, News, Trends, AIMentor
│   ├── models/                 # User, Company, Job, Skill, News, JobTrend, Roadmap, LearningResource, UserProgress
│   ├── routes/                 # All API routes
│   ├── middleware/             # authMiddleware, errorHandler
│   ├── seed/                   # seedDatabase.js + data JSON files
│   ├── services/               # crsService, skillGapService, aiService
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have these installed on your computer:

- [Node.js](https://nodejs.org) (LTS version)
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com)

### Installation

**Step 1 — Clone the repository:**
```bash
git clone https://github.com/Fayzul-wahit/JFinder-AI.git
cd JFinder-AI
```

**Step 2 — Install backend dependencies:**
```bash
cd backend
npm install
```

**Step 3 — Install frontend dependencies:**
```bash
cd ../frontend
npm install
```

**Step 4 — Create environment files:**

Create `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jfinderai
JWT_SECRET=jfinderai_super_secret_key_2024
SESSION_SECRET=jfinderai_session_secret_2024
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000
```

**Step 5 — Make sure MongoDB is running on your computer**

Check Windows Services → MongoDB should show "Running"

**Step 6 — Seed the database (optional — loads sample data):**
```bash
cd backend
npm run seed
```

### Running the Project

Open **two terminals** and run:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
Backend runs at: `http://localhost:5000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:5173`

Open your browser and go to: **http://localhost:5173**

---

## User Flow

```
Landing Page (public)
        ↓
    Sign Up / Login
        ↓
  Onboarding (6 Steps)
  Step 1: Basic Info (name, college, degree, CGPA)
  Step 2: Skills (multi-select)
  Step 3: Projects
  Step 4: Resume Upload
  Step 5: Certifications (yes/no conditional)
  Step 6: Career Goal (dream job + dream company)
        ↓
  AI Analysis Loading Screen
        ↓
     Dashboard
```

---

## Design System

| Token | Value |
|---|---|
| Primary Background | `#0A0A1A` |
| Secondary Background | `#0F0F2E` |
| Card Background | `#13132A` |
| Primary Accent (Violet) | `#7C3AED` |
| Text Primary | `#FFFFFF` |
| Text Secondary | `#94A3B8` |
| Font | Inter |

---

## Database Collections

| Collection | Description |
|---|---|
| users | User accounts and profiles |
| companies | 20 tracked companies |
| jobs | 100 job records across companies |
| skills | Required skills per job role |
| news | Career and tech news articles |
| jobTrends | Market trend data per skill |
| roadmaps | Level-based learning paths |
| learningResources | Course recommendations |
| userProgress | Roadmap progress and XP |

---

## Pages Status

| Page | Status |
|---|---|
| Landing Page | ✅ Complete |
| Sign Up | ✅ Complete |
| Login | ✅ Complete |
| Onboarding | ✅ Complete |
| Dashboard | ✅ Complete |
| Career Roadmap | ✅ Complete |
| Skill Gap Analysis | ✅ Complete |
| Company Intelligence | ✅ Complete |
| Job Trend Analysis | ✅ Complete |
| Projects | 🔄 In Progress |
| Certifications | 🔄 In Progress |
| Industry News | 🔄 In Progress |
| Profile | 🔄 In Progress |
| Settings | 🔄 In Progress |
| AI Mentor Chatbot | ✅ Complete (floating button) |

---

## Future Features

- Flutter mobile application
- Live job portal API integration (LinkedIn, Naukri, Indeed)
- Dynamic CRS weight calculation per job role
- Automated certificate verification (OCR)
- Vector database for semantic skill matching (Pinecone)
- Mock interview (text and voice)
- Resume builder and ATS checker
- Portfolio builder
- Mentor system and networking
- Recruiter portal
- College dashboard

---

## Important Note on Data

This is a **prototype**. All company, job, skill, and market data is manually researched and seeded into the database. Live API integration with job portals is planned for the production version.

The platform analyzes **publicly available, aggregate market-level information** only. JFinder AI does not claim knowledge of individual hiring or termination decisions.

---

## Team

Built by the JFinder AI team as part of an academic research project exploring AI-powered career guidance systems.

---

## License

This project is currently private and under active development.

---

*JFinder AI — Helping students land their dream job at their dream company.*
