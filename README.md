# QuickBasket

**A multi-service hyperlocal delivery platform.**
Grocery first — then Food, Laundry, and Porter (pickup/drop logistics), all under one app.

---

## What This Is

QuickBasket lets a customer open one app, pick their exact location (GPS or manual), and order from nearby grocery stores today — with Food, Laundry, and Porter services rolling out in later phases on the same platform. One brand, one wallet, one order-tracking experience, multiple services.

Built for multi-city from day one: every store, product, and order is scoped to a city so QuickBasket can launch in Lucknow first and expand to other cities without a rebuild.

## Tech Stack (current)

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router), React |
| Backend | Node.js API (see `docs/ARCHITECTURE.md`) |
| Package management | npm workspaces (monorepo) |
| Icons | [Lucide](https://lucide.dev) |
| Languages | English + Hindi (i18n from day one) |
| Dev environment | Ubuntu (WSL), VS Code Insiders, Node via NVM |

This table will change as decisions get locked — check `docs/DECISIONS.md` for the current source of truth before assuming anything below the frontend layer.

## Quick Start

```bash
# 1. Use the right Node version
nvm use

# 2. Install dependencies (run from repo root — this is a monorepo)
npm install

# 3. Copy environment template and fill in values
cp .env.example .env.local

# 4. Run the customer web app
npm run dev --workspace=apps/web
```

App should be live at `http://localhost:3000`.

## Project Structure

```
quickbasket/
├── apps/               # Frontend apps (customer web today; admin/vendor later)
│   └── web/            # Customer-facing Next.js app
├── backend/            # API server(s) — auth, catalog, orders, payments...
├── packages/           # Shared code: UI kit, types, config, utils
├── docs/               # All product & engineering documentation (see map below)
├── README.md           # You are here
├── AGENTS.md           # Rules for AI coding agents (Cline, OpenCode, Claude Code)
├── PROJECT_RULES.md    # Coding standards & git workflow
├── CLAUDE.md           # Claude Code specific context
├── CHANGELOG.md        # What shipped, in order
├── PROJECT.md          # One-page project overview
└── notes.md            # Founder's scratchpad — open questions & ideas
```

## Docs Map (`/docs`)

| File | What's in it |
|---|---|
| `PRD.md` | What we're building and for whom, feature by feature |
| `ARCHITECTURE.md` | How the system is put together |
| `API_SPEC.md` | Every backend endpoint, request/response shape |
| `DATABASE.md` | Tables, fields, relationships |
| `DESIGN_SYSTEM.md` | Colors, spacing, components, motion |
| `BRAND_GUIDELINES.md` | Voice, tone, logo, brand colors |
| `DECISIONS.md` | Every major decision, with why |
| `ROADMAP.md` | Phase 1 (Grocery) → Phase 4 (Porter) |
| `TASKS.md` | Current backlog, grouped by area |
| `PROMPTS.md` | Copy-paste prompts for ChatGPT / OpenCode / Cline |

## How We Work

- **ChatGPT** — architecture discussions, documentation, reviewing plans before they're built.
- **OpenCode CLI** — large implementations (new modules, big features).
- **Cline** — small, contained tasks (a fix, a component, a tweak).
- **Rule:** test the feature, then commit. Never leave a broken app on `main`.

See `AGENTS.md` for the full rulebook every AI tool should follow on this project, and `PROJECT_RULES.md` for coding/git conventions.

## Status

Customer web app scaffolded on Next.js, basic homepage live, full documentation scaffold in place. See `docs/ROADMAP.md` for what's next and `docs/TASKS.md` for the active backlog.
