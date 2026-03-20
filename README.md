# ReBooted 

### "Never too late to reboot"

## Demo Video

https://youtu.be/maUVhdQqMD4

---

## 1. Project Overview

### Problem Statement & Target Users

Chinese-speaking immigrant seniors struggle with technology not just because of language barriers, but because of tech anxiety, unfamiliar UI patterns, and lack of patient guidance.

- Google Translate just converts words — it does not teach
- ChatGPT requires you to know what to ask
- No existing app is designed for seniors with low tech literacy and high anxiety

**Target Users:** Chinese-speaking seniors (60+), low tech literacy, aging eyesight and limited dexterity, often living near adult children who are too busy to help.

**Personal Origin Story:** I taught weekly technology and English lessons to 25+ Chinese-speaking senior citizens for 4 years, answering 50+ tech questions per month. ReBooted is built from 4 years of real observed struggles — not assumed user needs.

### Solution Summary & Key Features

ReBooted is a Progressive Web App that transforms how Chinese-speaking seniors learn technology — not through a generic chatbot or a language translator, but through a structured curriculum built from 4 years of real classroom experience.

Most technology tools assume you already know how to use technology. ReBooted starts from zero. Every screen is designed around one core insight gained from teaching seniors weekly: the biggest barrier is not language: it is confidence. Seniors do not fail because they cannot learn. They fail because existing apps were never designed for them.

ReBooted solves this in three layers:

**Layer 1: Structured Learning**

A 4-week curriculum that mirrors a real class schedule. Seniors see one week at a time, with each week unlocking after the previous is complete. This prevents overwhelm and creates a sense of progress and routine — the same structure that made in-person classes effective for 4 years.

- Week 1: Getting Started — Video Calls, Send Photos, Using Maps, Stay Safe Online
- Week 2: Getting Around — Using Transit, Ordering a Ride, Saving Locations, Bus Schedules
- Week 3: Going to the Post Office — Tracking Packages, Finding Post Office, Paying Bills, Filling Online Forms
- Week 4: Going to a Restaurant — Finding Restaurants, Reading Reviews, Making Reservations, Ordering Delivery

**Layer 2: Patient AI Guidance**

An AI tutor powered by Anthropic Claude thatresponds in English and Chinese, translates unfamiliar tech words on demand, and always ends with encouragement. Three pre-seeded questions appear on every step so they always know where to start.

**Layer 3: Family Connection**

A family portal where adult children monitor progress in real time via Firebase Realtime Database, send encouragement messages that appear as banners on the senior home screen, and track their loved one's daily streak. Together these three layers create something no existing app offers: a complete digital literacy companion that teaches, encourages, and connects — all in the user's language, at their pace, with their family alongside.

**Additional Features:**

- Panic Button on every screen — addresses the "freeze moment" when seniors hit an unexpected screen and shut down
- Daily streak counter with milestone celebrations visible to family
- Confetti celebration on module completion
- Bilingual toggle English/中文 persists across sessions
- Kiro mascot guide throughout the app

---

## 2. Design Decisions

### Technology Choices & Alternatives Considered

| Decision | Choice | Alternative | Reason |
|---|---|---|---|
| Database | Firebase Realtime DB | MongoDB | Faster setup, real-time sync built in |
| AI Model | Anthropic Claude (claude-sonnet-4-5) | OpenAI, AWS Bedrock | Better tone control, bilingual quality |
| Auth for seniors | None (localStorage) | Account creation | Frictionless — no login barrier |
| Family linking | 6-digit code | Account-based | Can be written on paper |
| State management | React Context API | Redux | Simpler for this scope |
| i18n | Custom JSON solution | i18next | Lighter, full bilingual control |
| Frontend | React + Next.js 14 + Tailwind | — | Builder existing skill set |

### Trade-offs

- **Simplicity over features:** Senior UX prioritized over feature count — 4 complete weeks beats 10 half-built modules
- **Speed over scalability:** Firebase chosen for hackathon — AWS Bedrock noted as future enterprise scaling path
- **Frictionless over secure:** No senior login — acceptable because data is non-sensitive progress tracking only
- **Anthropic over AWS Bedrock:** Evaluated AWS Bedrock as alternative but chose direct Anthropic API for faster iteration and simpler authentication during hackathon. AWS Bedrock migration documented as future enhancement.

### Security & Scalability Considerations

- Claude API key stored server-side in Next.js API route — never exposed to client
- Firebase rules: only document matching access code is readable
- No PII stored — only progress state and optional name set by family member
- Graceful degradation: app works offline for loaded content, Firebase sync is non-blocking
- Scalability path: Firebase scales automatically, JSON-based modules require zero backend changes to add new content
- Future: AWS Bedrock for enterprise AI inference at scale with same Claude models

---

## 3. Kiro Usage

### Spec-Driven Development

ReBooted was built using Kiro's spec-first workflow, requirements and design documents were generated BEFORE any code was written.

**Workflow:** Requirements doc → Design doc → Task list → Implementation

- **Requirements doc:** requirements covering all user flows, accessibility rules, and bilingual requirements
- **Design doc:**  correctness properties, full component specs, error handling matrix, testing strategy with fast-check property-based tests
- **Task list:**  implementation tasks with 5 checkpoints for incremental validation

**Comparison to vibe coding:** Spec-driven development produced more consistent, accessible components. When constraints were defined upfront, Kiro applied them universally without needing corrections. Pure vibe coding without specs produced generic components that needed multiple rounds of accessibility fixes.

### Vibe Coding

The initial kickoff prompt was highly detailed — covering problem statement, target users, features, tech stack, and design rules in one structured prompt.

**Best code generation moments:**

- Tasks 2 and 3: Kiro built both LanguageProvider and ProgressProvider including 6-digit access code generation, localStorage persistence, and SSR error handling in a single execution. Zero corrections needed.
- Tasks 4 and 5: Complete home screen with colored module buttons, language toggle, panic button, and routing generated in one pass from spec.
- Task 11: Entire AI tutor integration including API route, exponential retry logic, bilingual system prompt, suggested questions, and chat UI built from spec alone.

**Conversation structure strategy:** Long detailed prompts with explicit constraints outperformed short prompts with corrections. Providing hex color values, pixel sizes, and Chinese text examples in the initial prompt produced senior-appropriate output immediately.

### Steering Docs

Explicit senior-friendly constraints were provided in steering docs and applied to ALL generated components automatically:

- 22px minimum font size
- 48px minimum tap targets (64px for panic)
- Maximum 4 elements per screen
- Warm color palette with specific hex values
- Slow animations 300-500ms only
- No hover-only interactions
- Bilingual layout rules for Chinese text

**Key result:** Zero accessibility corrections needed after generation. Constraints set once, applied everywhere consistently.

**Most effective strategy:** Providing negative examples alongside positive ones. "Never use hover-only interactions — seniors use touch exclusively" produced better results than "use touch-friendly interactions."

### Agent Hooks

- Firebase Realtime Database setup and security rules configured automatically
- Bilingual translation JSON files generated from component specs
- All 4 weeks of module content generated from a curriculum outline in one prompt
- Package dependencies resolved automatically when new features were specced

### MCP

Kiro's MCP capabilities were used to:

- Verify Firebase connection and database URL configuration
- Debug API route authentication issues
- Validate environment variable structure for Next.js

---

## 4. Learning Journey & Forward Thinking

### Biggest Challenges & How I Overcame Them

| Challenge | Solution | What I Learned |
|---|---|---|
| Node.js v18 incompatible | Upgraded to v20 via nvm | Verify runtime requirements first |
| Tailwind v4 Mac ARM64 bug | Clean reinstall with v3 | npm optional dependency bugs need clean reinstall |
| Infinite loop in useEffect | useCallback + stable refs | React dependency arrays need stable references |
| Firebase not syncing | Added immediate sync on app load | localStorage and cloud are separate systems |
| Turbopack cache corruption | Deleted .next folder | Cache corrupts when switching Node versions |

### What I Would Do Differently

- Set up all API keys before starting to build
- Have a clean set up before building
- Use Firebase from the start instead of adding it as an afterthought

### Skills Gained

- Spec-driven development workflow with Kiro
- Firebase Realtime Database architecture
- Senior-accessible UI design principles
- Bilingual React application architecture

### Future Enhancements & Scaling Plans

- **AWS Bedrock migration** — same Claude models, enterprise scalability, full AWS ecosystem integration
- **AWS Amplify deployment** — CI/CD pipeline, automatic deployments, global CDN
- **Voice note encouragement** — family members record audio messages for seniors
- **Family custom lessons** — family adds app-specific tutorials for their senior
- **Community class mode** — group learning sessions with multiple seniors
- **More languages** — Tagalog, Spanish, Korean, Vietnamese
- **Offline-first** — full offline capability for all 4 weeks without internet
- **Real screenshots** — replace emoji illustrations with actual phone screenshots

---

## Architecture

### System Architecture

```
Client (PWA)
├── React 18 + Next.js 14 (App Router)
├── TypeScript
├── Tailwind CSS (senior design tokens)
├── React Context API
│   ├── LanguageProvider (EN/ZH + localStorage)
│   └── ProgressProvider (progress + Firebase)
└── localStorage (offline + SSR fallback)

Backend Services
├── Firebase Realtime Database
│   ├── Family portal real-time sync
│   ├── Encouragement message delivery
│   └── Streak tracking
└── Anthropic Claude API (claude-sonnet-4-5)
    └── /api/ai-tutor (server-side route)
        ├── Bilingual system prompt
        ├── Module + step context injection
        ├── Exponential retry (3 attempts)
        └── Graceful error handling
```

### Component Hierarchy

```
App
├── LanguageProvider
└── ProgressProvider
    └── Layout
        ├── PanicButton (every screen, z-9999)
        └── PageContainer
            ├── HomeScreen (4-week curriculum)
            ├── LearningModule
            │   ├── ModuleStep
            │   └── CelebrationScreen
            ├── AITutorPanel (Claude API)
            └── FamilyPortal
                ├── AccessCodeEntry (6-digit PIN)
                └── ProgressDashboard (Firebase)
```

---

## Setup Instructions

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/l3mxny/AWS-Hackathon
cd AWS-Hackathon/rebooted
npm install
```

### Environment Variables

Create `.env.local` in the rebooted folder:

```
ANTHROPIC_API_KEY=your_anthropic_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_db_url
```

### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### Access Family Portal

Go to http://localhost:3000/family

Enter the 6-digit code shown at the bottom of the senior home screen.
