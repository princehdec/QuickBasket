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
- [x] Finalize schema in `DATABASE.md` for: users, addresses, cities, stores, products, carts, orders, payments (via packages/types)
- [ ] Auth endpoints
- [ ] Catalog endpoints (stores, products, search)
- [ ] Cart/order endpoints
- [ ] Payment webhook handling

## Documentation Upkeep (ongoing)
- [ ] Keep `DECISIONS.md` current as choices are made
- [ ] Keep `CHANGELOG.md` current as features ship
- [ ] Revisit `notes.md` open questions before they block Phase 1 completion

## Shared Foundation (Phase 0)
- [x] Create packages/types — shared TypeScript types for User, Store, Product, Category, Cart, Order, Address, Payment
- [x] Create packages/config — shared config: env variable schema, constants, API base URLs, feature flags
- [x] Create packages/ui — scaffold primitives for auth screens (Button, Input, Card, Layout)
- [x] Wire packages/types, packages/config, packages/ui into apps/customer-web as workspace dependencies

## Khata Module (Neighborhood Credit Ledger)
- [x] Convert Stitch-generated static HTML mockups to Next.js/React screens
- [x] Rebrand from "Apna Market" to "QuickBasket" across all screens
- [x] Recolor using QuickBasket's orange theme (#FF6B1A) instead of mockup teal/amber
- [x] Implement 10 screens: phone entry, OTP verification, khata home, link shop, customer khata details, shop owner management, review request, customer khata detail (merchant view), log purchase, log repayment
- [x] Add khata-related types to packages/types (KhataEntry, LinkedShop, KhataRequest, KhataSummary, LogPurchaseInput, LogRepaymentInput)
- [x] Create khata-specific components (KhataLedgerItem, KhataSummaryCard)
- [x] Set up khata module structure in apps/customer-web/khata/


## Confirmed Multi-App Expansion
- [ ] Replace password-first authentication with phone OTP challenge, verification, rate limits, and session issuance
- [ ] Add Lucknow and Gopalganj city records and configurable service zones
- [ ] Add business-specific serviceability, distance bands, and admin pause controls; default pilot radius 5 km, extendable to 8 km
- [ ] Add online-only payment configuration; COD disabled at launch
- [ ] Add payment attempts, signed webhook verification, idempotency, and refund reconciliation
- [ ] Add managed and third-party delivery partner source fields, assignment, reassignment, and delivery jobs
- [ ] Add vendor roles, staff permissions, weekly settlement batches, and ledger entries
- [ ] Build customer mobile app for Android/iOS
- [ ] Build delivery-partner mobile app for Android/iOS
- [ ] Build vendor web/PWA
- [ ] Build vendor mobile app for Android/iOS
- [ ] Build admin operations web app
- [ ] Add category modules: general stores, pharmacy, electronics, stationery, dry cleaning, bakery, restaurant, small shops, and garments
- [ ] Add OTC pharmacy flow
- [ ] Add prescription upload, pharmacist review, approval/rejection history, and restricted-product controls
- [ ] Add category-specific workflows for restaurant modifiers/preparation, dry-cleaning slots/intake, and garment/electronics variants
- [ ] Add bilingual English/Hindi coverage across every new surface
- [ ] Add end-to-end tests for customer → vendor → partner → admin order lifecycle and failure recovery
