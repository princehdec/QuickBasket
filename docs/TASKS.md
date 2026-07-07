# Tasks — Active Backlog

Grouped by area. Check items off as they're completed, and add a line to `CHANGELOG.md` when a whole feature ships. Keep this file as the single source of truth for "what's next" — `ROADMAP.md` is the phase-level view, this is the week-to-week view.

## Design System
- [ ] Lock color tokens (Orange primary + neutrals + semantic colors) — `DESIGN_SYSTEM.md`
- [ ] Lock typography scale
- [ ] Define border-radius token (slightly rounded, per brand direction)
- [ ] Define animation/transition timing (fast, snappy)
- [ ] Set up Lucide icon usage pattern/wrapper component

## Homepage
- [ ] Service grid (Grocery active; Food/Laundry/Porter shown as "coming soon")
- [ ] Rotating offers banner (data-driven, not hardcoded — see `notes.md` on non-technical banner updates)
- [ ] Categories section
- [ ] Nearby stores section (depends on location + store search backend)

## Location
- [ ] GPS detection with permission prompt
- [ ] Manual address entry/search fallback
- [ ] City resolution logic (map address/coords → city record)

## Authentication
- [ ] Signup flow
- [ ] Login flow
- [ ] Session handling
- [ ] (Decide) OTP vs. password — log decision in `DECISIONS.md`

## Grocery Module
- [ ] Store listing page
- [ ] Store detail page (categories + products)
- [ ] Product detail page
- [ ] Product & store search
- [ ] Cart (add/remove/update quantity)
- [ ] Checkout flow
- [ ] Payment integration (gateway TBD — see `notes.md`)
- [ ] Order confirmation
- [ ] Basic order status tracking

## Backend / Data
- [ ] Finalize schema in `DATABASE.md` for: users, addresses, cities, stores, products, carts, orders, payments
- [ ] Auth endpoints
- [ ] Catalog endpoints (stores, products, search)
- [ ] Cart/order endpoints
- [ ] Payment webhook handling

## Documentation Upkeep (ongoing)
- [ ] Keep `DECISIONS.md` current as choices are made
- [ ] Keep `CHANGELOG.md` current as features ship
- [ ] Revisit `notes.md` open questions before they block Phase 1 completion
