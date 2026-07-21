# JFinder AI — Your Personal AI Career Intelligence Platform

> An AI-powered Career Operating System that continuously understands the market and guides users toward their dream careers.

---

## 🚀 Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | React.js (Vite), React Router v6    |
| Styling      | Vanilla CSS + CSS Variables         |
| Charts       | Recharts                            |
| Icons        | Lucide React                        |
| HTTP Client  | Axios                               |
| Backend      | Node.js + Express.js                |
| Database     | MongoDB + Mongoose                  |
| Auth         | Google OAuth 2.0 (Passport.js)      |
| File Storage | Cloudinary                          |
| AI Engine    | OpenAI / Claude API (placeholder)   |

---

## 📁 Project Structure

```
JFinder/
├── frontend/                   # React.js web app (Vite)
│   ├── src/
│   │   ├── assets/             # Images, icons
│   │   ├── components/
│   │   │   ├── common/         # Button, Card, Badge, Input, Modal
│   │   │   ├── layout/         # Navbar, Sidebar, Footer
│   │   │   └── charts/         # ReadinessChart, TrendGraph, DigitalTwin
│   │   ├── pages/              # Landing, Auth, Onboarding, Dashboard, ...
│   │   ├── context/            # AuthContext, UserContext
│   │   ├── hooks/              # useAuth, useUser, useCRS
│   │   ├── services/           # api.js, auth.js
│   │   ├── utils/              # crsCalculator.js, helpers.js
│   │   ├── styles/             # theme.css, global.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env
│
├── backend/                    # Node.js + Express
│   ├── config/                 # db.js, passport.js
│   ├── controllers/            # authController, userController, crsController, ...
│   ├── models/                 # User, Company, Job, Skill, News, JobTrend, ...
│   ├── routes/                 # auth, user, crs, skillGap, roadmap, company, ...
│   ├── middleware/             # authMiddleware.js, errorHandler.js
│   ├── services/               # crsService, skillGapService, aiService
│   ├── seed/                   # seedDatabase.js + data/*.json
│   ├── app.js
│   └── server.js
│
└── README.md
```

---

## 🎨 Design System

| Token               | Value       | Purpose                          |
|---------------------|-------------|----------------------------------|
| `--bg-primary`      | `#0A0A1A`   | Main background                  |
| `--bg-secondary`    | `#0F0F2E`   | Sidebar, secondary backgrounds   |
| `--bg-card`         | `#13132A`   | Card backgrounds                 |
| `--accent-primary`  | `#7C3AED`   | Main violet brand color          |
| `--accent-secondary`| `#9F67F7`   | Hover states                     |
| `--accent-highlight`| `#A855F7`   | Badges, tags                     |
| `--text-primary`    | `#FFFFFF`   | Headings                         |
| `--text-secondary`  | `#94A3B8`   | Body text                        |
| `--text-muted`      | `#64748B`   | Metadata, timestamps             |
| `--border-color`    | `#1E1B4B`   | Subtle dark borders              |
| `--success`         | `#10B981`   | Success states                   |
| `--warning`         | `#F59E0B`   | Warnings                         |
| `--danger`          | `#EF4444`   | Errors, destructive actions      |
| `--live`            | `#22C55E`   | Live/active indicators           |

---

## ⚡ Career Readiness Score Formula

```
CRS = (W1 × S) + (W2 × A) + (W3 × P) + (W4 × C) + (W5 × R)

Where:
  S = Technical Skills Match  — Weight: 0.40 (40%)
  A = Academic Performance    — Weight: 0.10 (10%)
  P = Project Relevance       — Weight: 0.25 (25%)
  C = Certifications          — Weight: 0.15 (15%)
  R = Resume Quality          — Weight: 0.10 (10%)
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- Google OAuth credentials

### 1. Clone & Install

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Configure Environment Variables

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**Backend** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jfinderai
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
AI_API_KEY=your_openai_or_claude_key
CLOUDINARY_URL=your_cloudinary_url
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

### 4. Start Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Frontend runs at: **http://localhost:5173**  
Backend API runs at: **http://localhost:5000**

---

## 📡 API Endpoints

| Method | Endpoint                      | Auth  | Description                    |
|--------|-------------------------------|-------|--------------------------------|
| GET    | `/api/auth/google`            | No    | Initiate Google OAuth          |
| GET    | `/api/auth/google/callback`   | No    | Google OAuth callback          |
| GET    | `/api/auth/me`                | JWT   | Get current user               |
| GET    | `/api/users/profile`          | JWT   | Get user profile               |
| PUT    | `/api/users/profile`          | JWT   | Update user profile            |
| GET    | `/api/crs`                    | JWT   | Get Career Readiness Score     |
| GET    | `/api/skill-gap`              | JWT   | Get skill gap analysis         |
| GET    | `/api/roadmap/:jobRole`       | JWT   | Get roadmap for job role       |
| POST   | `/api/roadmap/progress`       | JWT   | Update lesson progress         |
| GET    | `/api/companies`              | No    | Get all companies              |
| GET    | `/api/companies/:id`          | No    | Get company detail             |
| GET    | `/api/companies/recommendations` | JWT | Get company recommendations  |
| GET    | `/api/news`                   | No    | Get news feed                  |
| GET    | `/api/trends`                 | No    | Get job trends                 |
| POST   | `/api/ai-mentor/chat`         | JWT   | Chat with AI Mentor            |

---

## 🗄️ Database Collections

| Collection        | Purpose                                      |
|-------------------|----------------------------------------------|
| `users`           | User profiles, skills, projects, certs       |
| `companies`       | 20 seeded companies with hiring data         |
| `jobs`            | 100 job records across all companies         |
| `skills`          | Skills mapped to each job role               |
| `news`            | Static news articles for the news feed       |
| `jobtrends`       | Skill demand trends and salary data          |
| `roadmaps`        | Level-based learning roadmaps per job role   |
| `learningresources` | Courses, videos, docs per skill            |
| `userprogresses`  | XP, badges, streaks, completed lessons       |

---

## 🎮 Gamification

| Action              | XP Reward |
|---------------------|-----------|
| Complete lesson     | +10 XP    |
| Complete quiz       | +20 XP    |
| Upload certificate  | +50 XP    |
| Complete project    | +100 XP   |
| 7-day streak        | +200 XP   |

**Badge Tiers:** Bronze → Silver → Gold → Diamond → Master

---

## 🔮 Roadmap (Future Features)

- [ ] Flutter mobile app
- [ ] Live API integration (LinkedIn Jobs, Indeed, News APIs)
- [ ] Vector DB (Pinecone/ChromaDB) for semantic search
- [ ] Mock Interview (text + voice)
- [ ] ATS Resume Checker
- [ ] Portfolio Builder
- [ ] Recruiter Portal
- [ ] College Dashboard
- [ ] Microsoft & LinkedIn login
- [ ] Automated certificate verification (OCR)

---

## 📄 License

© 2025 JFinder AI. All rights reserved.
