# AGENTS.md — Rules for AI Coding Agents on QuickBasket

This file is for **any AI tool** working on this codebase — ChatGPT, OpenCode CLI, Cline, Claude Code, or anything else. Read this before writing or changing any code.

## Who's Building This

The founder is **non-technical**. He directs the project by describing what he wants and pasting prompts between tools — he does not read or write code himself. This changes how you should work:

- Never assume he'll "just fix it in the code" — if something needs a decision, ask in plain English, don't leave a `// TODO: confirm with founder` and move on silently.
- Explain what you did in plain language in your summary/commit message, not just in code comments.
- Prefer boring, well-documented solutions over clever ones. Nobody on this project can debug clever.

## Read Before You Start

In this order:
1. `PROJECT.md` — what QuickBasket is
2. `docs/PRD.md` — what we're building right now and why
3. `docs/ARCHITECTURE.md` — how it's put together
4. `docs/DECISIONS.md` — decisions already made (don't re-litigate these without flagging it explicitly)
5. `PROJECT_RULES.md` — coding standards & git workflow
6. `docs/DESIGN_SYSTEM.md` — if you're touching UI at all

## Division of Labour

| Tool | Job |
|---|---|
| **ChatGPT** | Architecture discussions, documentation, reviewing plans *before* they're built |
| **OpenCode CLI** | Large implementations — a new module, a big feature, multi-file changes |
| **Cline** | Small, contained tasks — a bugfix, a single component, a copy tweak |
| **Claude Code** | See `CLAUDE.md` for specifics |

If you're an agent and the task in front of you clearly belongs to a different tool's lane (e.g. you're Cline and being asked to build an entire module), say so instead of quietly doing it — it affects how the founder reviews the work.

## Ground Rules

1. **Don't invent new tech stack choices.** If the task seems to need a new library, database, or service that isn't in `docs/ARCHITECTURE.md` or `docs/DECISIONS.md`, stop and propose it as a decision first — don't just `npm install` something new and move on.
2. **Don't touch production data or run destructive database commands** without an explicit, separate confirmation from the founder in the same session.
3. **Test before you say you're done.** Every feature gets checked (manually or with a test) before it's called complete. See `PROJECT_RULES.md` for what "tested" means here.
4. **Commit after every completed feature**, not in one giant end-of-session commit. Small, reviewable commits.
5. **Follow the folder structure** in `docs/ARCHITECTURE.md`. Don't create new top-level folders under `apps/`, `backend/`, or `packages/` without updating that doc.
6. **Match the design system** (`docs/DESIGN_SYSTEM.md`) for anything user-facing — colors, spacing, icons (Lucide only), border radius, animation speed. Don't introduce a different visual language "just for this one screen."
7. **Update docs as you go:**
   - Shipped something? Add a line to `CHANGELOG.md`.
   - Made an architectural or product decision? Add an entry to `docs/DECISIONS.md`.
   - Finished a task from the backlog? Check it off / move it in `docs/TASKS.md`.
8. **Bilingual by default.** Any user-facing string should go through the i18n setup (English + Hindi), not be hardcoded in one language.
9. **Multi-city by default.** Don't hardcode a single city, store, or region anywhere in queries or logic — everything is scoped by city per `docs/DATABASE.md`.

## When You're Unsure

If a prompt is ambiguous, or the "right" answer depends on a product decision nobody's made yet — don't guess silently. State the assumption you're making out loud, in plain language, and keep moving. If it's a big enough decision (changes cost, timeline, or user experience materially), flag it clearly as something the founder should confirm before you build further on top of it.
