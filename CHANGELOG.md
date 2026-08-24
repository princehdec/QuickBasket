# Changelog

All notable changes to QuickBasket are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/) — newest at the top.

## [Unreleased]

### Changed
- **Privacy hardening:** disabled SQL and parameter logging in the backend so development-mode console-OTP testing does not expose phone numbers, OTP hashes, addresses, or other user data in Render logs.

- **Full visual redesign — "Kirana Modern"**: every screen restyled around warm
  paper surfaces, a deep bottle-green primary, turmeric reserved for offers, and
  khata red reserved for the credit ledger. Typography switched from Geist to
  Baloo 2 (display) + Mukta (body), both Devanagari-capable. Receipt-style bill
  summaries, ruled-paper khata ledgers, warm-tinted grays and shadows, staggered
  section entrances, and unified buttons/cards/empty states. No behaviour,
  links, or copy changed.
- Khata redesigned in the same language with its own "red book" identity and
  mounted at `/khata` with a header link (previously unreachable dead code).
- Fixed pre-existing breakage in the khata module (missing `date-fns`,
  non-existent `Select` import, wrong import paths in `packages/ui`) so the app
  type-checks and builds again.

### Added
- **Persisted delivery addresses:** authenticated address list/create/update/delete API with user ownership, default-address handling, and soft deletion; customer checkout now loads real UUID-backed addresses and lets signed-in customers add a delivery address.
- Product catalog responses now include friendly category names and stable slugs, so live store tabs group products by their real business categories.
- Customer product details now load live product and business data, including live stock state and same-store product rails for related and frequently bought items.
- Customer home nearby stores and trending products now load from the live catalog and follow the selected city when available.
- Customer search now queries live city-scoped stores and products, including real category, brand, and description matching.
- Shared UI primitives: `PageHeader`, `EmptyState`, `VegMark`, plus Badge

  variants (`offer`, `khata`, `success`) and Button variants (`accent`, `khata`).
- `docs/DESIGN_SYSTEM.md` rewritten as the Kirana Modern spec (ADR-008).

### Added
- **Khata Module**: Neighborhood credit ledger feature with 10 screens:
  - Phone entry and OTP verification
  - Khata home (overview, activity, shops)
  - Link shop / request khata
  - Customer khata details (customer view)
  - Shop owner khata management
  - Review request (merchant view)
  - Customer khata detail (merchant view)
  - Log purchase and log repayment (merchant view)
- Khata-related types added to `@quickbasket/types`:
  - `KhataEntry`, `LinkedShop`, `KhataRequest`, `KhataSummary`, `LogPurchaseInput`, `LogRepaymentInput`
- Khata-specific UI components: `KhataLedgerItem`, `KhataSummaryCard`
- Shared foundation packages:
  - `@quickbasket/types`: TypeScript types for User, Store, Product, Category, Cart, Order, Address, Payment
  - `@quickbasket/config`: Environment variable schema, constants, API base URLs, feature flags
  - `@quickbasket/ui`: UI primitives for auth screens (Button, Input, Card, Layout) with orange brand theme
- Workspace dependencies wired into `apps/customer-web`

### Planned
- Production homepage (service grid, rotating offers banner, categories, nearby stores)
- Authentication (signup/login)
- Grocery module (catalog, cart, checkout, order tracking)

## [0.1.0] — Project Scaffold

### Added
- Development environment set up (Ubuntu/WSL, VS Code Insiders, Node via NVM, Git).
- Next.js app initialized for the customer-facing website.
- Basic QuickBasket homepage created (placeholder).
- Git repository initialized.
- Full documentation scaffold created: `README.md`, `AGENTS.md`, `PROJECT_RULES.md`, `CLAUDE.md`, `PROJECT.md`, `notes.md`, and everything under `docs/`.

### Decided
- Brand name: QuickBasket. Theme colour: Orange.
- Multi-service scope: Grocery → Food → Laundry → Porter.
- Bilingual from day one: English + Hindi.
- Multi-city architecture from day one.
- Icon set: Lucide.

---

*How to use this file: every time a feature is finished and merged to `main`, add a line under `[Unreleased]`, then move it into a dated/tagged section when you cut a release. Keep entries short — one line, plain language, no jargon a non-engineer can't parse.*
