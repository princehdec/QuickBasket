# CLAUDE.md — Context for Claude Code on QuickBasket

This file is read by Claude Code at the start of a session. Keep it accurate — it's the fastest way to get a session productive without re-explaining the whole project every time.

## Project in One Line

QuickBasket — multi-service hyperlocal delivery (Grocery now; Food, Laundry, Porter later). Next.js frontend, monorepo structure (`apps/`, `backend/`, `packages/`).

## Who You're Working With

The founder is **non-technical** — he doesn't read or write code. He drives this project by describing outcomes and pasting prompts between AI tools (ChatGPT, OpenCode CLI, Cline, Claude Code). Practical implications for you:

- Summarize what you changed in plain English at the end of a session — not just a diff.
- If you hit a decision point (library choice, schema change, UX tradeoff), explain the options simply and pick a sensible default rather than blocking — but say clearly what you assumed.
- Don't assume he can run arbitrary terminal commands you didn't explicitly give him, fully spelled out, if a manual step is ever needed.

## Before Making Changes

1. Read `docs/DECISIONS.md` — don't relitigate settled decisions without flagging it.
2. Read `docs/ARCHITECTURE.md` — respect the existing folder/module boundaries.
3. Check `docs/TASKS.md` — work from the backlog rather than inventing new scope mid-session.
4. If touching UI, check `docs/DESIGN_SYSTEM.md` for colors, spacing, icons (Lucide only), radius, and motion.

## Hard Rules

- **No destructive database operations** (drop, truncate, irreversible data migrations) without an explicit confirmation in the current session — even if a prior session already discussed it.
- **No new top-level dependencies or services** (a new DB, a new hosting provider, a new payment gateway) without proposing it first — add to `docs/DECISIONS.md` before wiring it in.
- **Test before declaring a feature done.** Run it, check it, then say it's done.
- **Commit after each completed feature** with a clear, plain-language commit message — not one giant end-of-session commit.
- **Bilingual (English + Hindi) and multi-city** are default requirements for anything user-facing or data-scoped — not edge cases to handle "later."

## After Making Changes

- Update `CHANGELOG.md` with what shipped.
- Update `docs/TASKS.md` — check off / move completed items.
- If you made an architectural or product call, log it in `docs/DECISIONS.md` with the reasoning, so the next session (or a different tool entirely) has the context.

## Where Things Live

- Frontend app(s): `apps/`
- API/backend: `backend/`
- Shared code (types, UI kit, config, utils): `packages/`
- All docs: `docs/` — see `README.md` for the full map.

## Current Focus

Check `docs/ROADMAP.md` for the active phase and `docs/TASKS.md` for the specific backlog items in flight right now — this file intentionally doesn't duplicate that list so it doesn't go stale.
