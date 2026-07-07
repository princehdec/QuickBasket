# Roadmap — QuickBasket

Phases, not fixed dates — durations are placeholders to help with planning and should be adjusted once Phase 1 velocity is known.

## Phase 0 — Setup ✅ Done

- Dev environment ready (Ubuntu/WSL, VS Code Insiders, Node via NVM, Git).
- Next.js app initialized, basic homepage created.
- Full documentation scaffold in place.

## Phase 1 — Grocery MVP (current)

**Goal:** A working, single-city grocery ordering experience, end to end.

1. Lock design system (`DESIGN_SYSTEM.md`) — colors, type, spacing, motion, components.
2. Production homepage — service grid, rotating offers banner, categories, nearby stores.
3. Authentication — signup/login.
4. Grocery module:
   - Store & product listing
   - Search (products + stores)
   - Cart
   - Checkout + payments
   - Basic order tracking
5. Address handling — GPS + manual, city resolution.
6. Bilingual pass — English + Hindi across all Phase 1 screens.

**Exit criteria:** a real customer in the launch city can find a nearby store, order groceries, pay, and track the order to delivery — without a developer in the loop.

## Phase 2 — Food

- Restaurant discovery, menu browsing, ordering — reusing the Grocery cart/checkout/tracking backbone.
- Extend search to cover restaurants + dishes.
- Extend homepage service grid to activate "Food."

## Phase 3 — Laundry

- Service provider network onboarding (in-house vs. partner model — see `notes.md` open question).
- Scheduling flow (pickup slot, drop slot) rather than instant checkout.
- Order tracking adapted for a scheduled-service model.

## Phase 4 — Porter (Local Pickup/Drop & Logistics)

- On-demand booking flow (pickup point, drop point, item description).
- Pricing model (distance/time-based).
- Rider/partner assignment, tracking.

## Cross-Cutting, Ongoing

- **Multi-city expansion** — once Phase 1 is stable in the launch city, expand city-by-city; this should mostly be a config/data exercise per `ARCHITECTURE.md`.
- **Vendor dashboard** — self-serve inventory management for store owners (parked until Phase 1 is stable).
- **Loyalty/rewards** — one wallet/points system across all services (parked, see `notes.md`).

## How to Use This Doc

When a phase's scope changes, update it here *and* log the reasoning in `DECISIONS.md`. When a phase starts, break it into concrete items in `TASKS.md`.
