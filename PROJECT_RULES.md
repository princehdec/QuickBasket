# PROJECT_RULES.md — Coding Standards & Workflow

These are the non-negotiable house rules for QuickBasket. AI agents and any human contributor follow these exactly.

## Git Workflow

- **Branches:**
  - `main` — always deployable. Never broken.
  - `staging` — where new features get integrated and tested together before `main`.
  - `feature/<short-description>` — one branch per feature, off `staging`.
- **Commits:** small and frequent, one logical change per commit. Use plain-language commit messages, e.g.:
  - `feat: add nearby stores list to homepage`
  - `fix: cart total not updating after quantity change`
  - `docs: update ROADMAP with laundry module scope`
- **Rule:** test the feature → then commit. Never commit broken code, even to a feature branch, without noting clearly in the commit message that it's a work-in-progress (`wip:`).
- **Merging to `main`:** only after the feature has been tested on `staging`.

## Code Style

- **Language:** TypeScript everywhere (frontend and backend) — strict mode on. No silent `any`.
- **Naming:**
  - Components: `PascalCase` (`NearbyStoresList.tsx`)
  - Functions/variables: `camelCase`
  - Files (non-component): `kebab-case` (`format-currency.ts`)
  - Database tables/columns: `snake_case`
- **Formatting:** Prettier + ESLint, run before every commit. Don't hand-format — let the tools do it so diffs stay clean.
- **Comments:** explain *why*, not *what*. Assume the next reader is non-technical trying to understand intent, not syntax.

## Environment & Secrets

- Never commit real secrets, API keys, or `.env` / `.env.local` files.
- Maintain a `.env.example` with every required variable name and a dummy/placeholder value, kept up to date whenever a new integration is added.
- Any new third-party service (payments, SMS, maps) needs its keys documented in `.env.example` and its purpose noted in `docs/ARCHITECTURE.md`.

## Database Changes

- Schema changes are proposed by updating `docs/DATABASE.md` first, then implemented via migration files — never by hand-editing a live database.
- Migrations are reviewed (by ChatGPT or in a session with the founder) before being applied to any shared/staging/production database.
- Destructive changes (dropping columns/tables, irreversible data changes) require explicit, separate confirmation before running — no exceptions.

## Testing

- Every feature gets manually verified end-to-end before being marked done, at minimum.
- Critical paths (signup/login, cart, checkout, payment, order tracking) should have automated tests as the codebase matures — don't ship payment logic on "it worked when I clicked through it once."
- If a bug is fixed, add a note (and a test where practical) so it doesn't silently regress.

## Security Basics

- Validate all input on the backend — never trust the frontend.
- Auth-protected routes must actually check auth server-side, not just hide a button in the UI.
- Rate-limit public endpoints that are expensive or abusable (search, OTP requests, etc.).
- Never log full payment details, passwords, or OTPs.

## Documentation Discipline

- Any decision that changes product direction, tech stack, or brand → goes into `docs/DECISIONS.md`.
- Any shipped feature → a line in `CHANGELOG.md`.
- Any finished backlog item → checked off in `docs/TASKS.md`.
- If code and docs disagree, that's a bug — fix the docs (or the code) in the same session, don't leave it dangling.
