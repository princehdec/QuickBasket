# Architecture — QuickBasket

## 1. High-Level Shape

```
┌─────────────────────────────────────────────────────────┐
│                      apps/web (Next.js)                  │
│   Customer-facing site — homepage, search, cart, orders  │
└───────────────────────────┬───────────────────────────────┘
                            │ HTTPS (REST, see API_SPEC.md)
┌───────────────────────────▼───────────────────────────────┐
│                        backend/ (API)                     │
│  Auth · Catalog · Search · Cart/Orders · Payments · Users  │
└───────────────────────────┬───────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   Database              Payments            3rd-party
 (see DATABASE.md)       Gateway          (Maps/GPS, SMS,
                                            Notifications)
```

`packages/` sits alongside both — shared TypeScript types, UI components, and config used by `apps/web` and (as more frontends appear) any future admin/vendor app.

## 2. Monorepo Layout

```
quickbasket/
├── apps/
│   └── web/            # Customer-facing Next.js app (Phase 1)
│       # future: apps/admin, apps/vendor
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── catalog/       # stores, products, categories
│   │   │   ├── search/
│   │   │   ├── cart/
│   │   │   ├── orders/
│   │   │   └── payments/
│   │   └── shared/            # db client, middleware, config
├── packages/
│   ├── ui/              # shared React components (design-system-driven)
│   ├── types/           # shared TypeScript types (API contracts, DB models)
│   └── config/          # shared eslint/tsconfig/tailwind config
└── docs/
```

**Rule:** a new top-level folder under `apps/`, `backend/`, or `packages/` is an architecture decision — log it in `DECISIONS.md` before an agent creates it.

## 3. Frontend (`apps/web`)

- **Framework:** Next.js, App Router.
- **Rendering:** server-rendered where it helps SEO/first-load speed (homepage, store/product pages); client-rendered for interactive bits (cart, checkout).
- **i18n:** English + Hindi from day one — all user-facing strings go through the i18n layer, never hardcoded.
- **State:** local/component state by default; a lightweight global store only for cart/session — avoid over-engineering state management before there's a reason to.
- **Styling/UI:** consumes `packages/ui`, which implements `DESIGN_SYSTEM.md` (Orange theme, Lucide icons, rounded corners, fast animations).

## 4. Backend (`backend/`)

- **Module boundaries mirror the eventual services:** `auth`, `catalog`, `search`, `cart`, `orders`, `payments`. Phase 1 ships these as a single deployable (a "modular monolith") rather than separate microservices — splitting into real services only if/when scale demands it. This keeps a non-technical founder's ops surface small.
- **Every catalog/order/store record is scoped by `city_id`.** This is the backbone of the multi-city requirement — see `DATABASE.md`. No query should assume a single city.
- **API contract:** REST, documented in `API_SPEC.md`. Response shape and error format are consistent across all modules (see that doc for the standard envelope).

## 5. Data Layer

See `DATABASE.md` for the full schema. Key architectural point: **city scoping**. Stores, products/inventory, offers, and orders all carry a `city_id` foreign key, so:
- Search and homepage queries always filter by the user's resolved city.
- Launching a new city is "add rows for that city," not "branch the code."

## 6. Multi-City Design

- User's city is resolved once (via GPS reverse-geocode or manual address selection) and cached in session/local state.
- All catalog, search, and offer queries take `city_id` as a required parameter — there is no "global" query path by design, to prevent a city leak becoming a habit.
- Expansion checklist when adding a new city: add city record → onboard stores for that city → seed initial offers → QA the homepage/search for that city.

## 7. Search

- Phase 1: straightforward filtered/sorted queries (by city, category, text match) against the database — no need for a dedicated search engine (e.g. Elasticsearch) at MVP scale.
- Revisit if/when product catalog size or query complexity outgrows simple DB queries — log that decision in `DECISIONS.md` when it happens, don't pre-optimize now.

## 8. Payments

- Integration point lives in `backend/src/modules/payments`.
- Gateway choice is an open decision — see `notes.md` and `DECISIONS.md` once locked.
- Webhook-driven order status updates (payment confirmed → order confirmed) happen server-side only, never trusted from the client.

## 9. Notifications

- Order status changes trigger notifications (push and/or SMS/WhatsApp — channel choice open, see `notes.md`).
- Kept as a thin, swappable module so the channel can change without touching order logic.

## 10. Environments

- **Local:** developer machine, `.env.local`.
- **Staging:** mirrors production, used for testing features from the `staging` branch before merge to `main`.
- **Production:** live customer-facing environment, deployed from `main` only.

## 11. What's Deliberately Not Decided Yet

To avoid over-building ahead of real needs, these are intentionally open until Phase 1 usage tells us more:
- Whether Food/Laundry/Porter become separate backend deployables or stay modules in the same backend.
- Whether a dedicated search service is ever needed.
- Delivery fleet architecture (in-house vs. partner network) — affects the `orders` module design once decided.

Track these in `notes.md` until they're resolved, then move the resolution here and into `DECISIONS.md`.
