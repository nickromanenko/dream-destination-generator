# Dream Destination Generator

A web app where you describe your ideal travel vibe and AI generates a bespoke destination with a custom travel poster, day-by-day itinerary, insider tips, and dynamic colour palette theming.

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **Backend**: Hono + Bun (TypeScript API)
- **AI**: Claude API (Haiku) for structured destination generation
- **Image Generation**: fal.ai (recraft-v3) for travel poster creation
- **Testing**: Vitest + React Testing Library
- **Deployment**: Firebase App Hosting (frontend) + Cloud Run (backend)

## Live Demo

**[https://prod--dream-destination-generator.us-central1.hosted.app/](https://prod--dream-destination-generator.us-central1.hosted.app/)**

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Bun](https://bun.sh/) runtime
- [pnpm](https://pnpm.io/) package manager

### 1. Clone and install

```bash
git clone <repo-url>
cd dream-destination-generator

# Backend
cd backend
pnpm install

# Frontend
cd ../frontend
pnpm install
```

### 2. Configure environment

**Backend** — create `backend/.env`:

```
ANTHROPIC_API_KEY=your-claude-api-key
FAL_KEY=your-fal-ai-key
```

**Frontend** — create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. Run development servers

```bash
# Terminal 1 — Backend
cd backend
pnpm run dev

# Terminal 2 — Frontend
cd frontend
pnpm run dev
```

Backend runs on `http://localhost:8080`, frontend on `http://localhost:3000`.

### 4. Run tests

```bash
# Backend tests (40 tests)
cd backend && pnpm test

# Frontend unit tests (39 tests)
cd frontend && pnpm test

# Frontend E2E tests — Playwright (44 tests, Chromium + Mobile Chrome)
cd frontend && pnpm test:e2e
```

## Architecture

```
┌────────────┐     SSE/JSON      ┌─────────────┐
│  Next.js   │ ───────────────── │  Hono + Bun  │
│  Frontend  │                   │   Backend    │
└────────────┘                   └──────┬───────┘
                                        │
                              ┌─────────┴─────────┐
                              │                    │
                         ┌────▼────┐         ┌────▼────┐
                         │ Claude  │         │  fal.ai │
                         │  API    │         │  FLUX   │
                         └─────────┘         └─────────┘
```

### Key Design Decisions

1. **Separate backend**: All AI API calls go through the Hono backend — API keys never reach the client.

2. **Claude tool_use**: Uses forced tool choice (`tool_choice: { type: "tool" }`) for reliable structured JSON. No fragile text parsing.

3. **SSE streaming**: The generate endpoint streams progress events (status → text_complete → image_complete → done) so the UI can show real-time feedback.

4. **Dynamic colour palette**: Claude generates a 5-colour palette per destination. The frontend applies these as CSS custom properties, dynamically theming the entire destination card.

5. **No database**: Saved trips use localStorage (max 20). This keeps the architecture simple for the challenge scope.

6. **Zod everywhere**: Request validation, Claude output validation, and client-side form validation all use Zod schemas, ensuring type safety at every boundary.

## Features

- **AI Destination Generation** — describe your vibe, get a complete destination package
- **Travel Poster** — AI-generated vintage-style poster via FLUX
- **Day-by-Day Itinerary** — timeline with morning/afternoon/evening activities and costs
- **Insider Tips** — local phrases, must-try dishes, hidden gems, cultural advice
- **Dynamic Theming** — each destination has a unique colour palette that themes the card
- **Save & Compare** — save up to 20 trips to localStorage
- **Regenerate** — independently regenerate text or image
- **Dark Mode** — system-aware with manual toggle
- **SSE Progress** — real-time status updates during generation
- **Responsive** — optimized for mobile and desktop

## Deployment

### Backend → Cloud Run

```bash
cd backend
gcloud run deploy dream-destination-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "ANTHROPIC_API_KEY=...,FAL_KEY=..." \
  --port 8080 \
  --project dream-destination-generator
```

### Frontend → Firebase App Hosting

Update `frontend/apphosting.yaml` with the Cloud Run URL, then:

```bash
firebase apphosting:backends:create --project dream-destination-generator
```

## Claude Code Usage

This project was built using Claude Code with the Superpowers plugin. Key observations:

- **Plan-first approach**: Used plan mode to design the full architecture, API contracts, and type definitions before writing code
- **TDD for backend**: Red/green/refactor cycle — wrote failing tests first, then implementation
- **Design system**: Used the UI/UX Pro Max skill for typography and colour recommendations
- **Parallel exploration**: Used subagents for codebase exploration and plan design

## Time Spent

~1 day
