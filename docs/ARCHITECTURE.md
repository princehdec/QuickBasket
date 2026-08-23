# Architecture — QuickBasket

## 1. High-Level Shape

```
┌─────────────────────────────────────────────────────────┐
│                 Customer Web (Next.js)                   │
│   Homepage, search, cart, checkout, orders, account       │
└───────────────────────────┬───────────────────────────────┘
                            │ HTTPS (REST, see API_SPEC.md)
┌───────────────────────────▼───────────────────────────────┐
│                        backend/ (API)                     │
│ Identity · Cities · Catalog · Orders · Dispatch · Payments │
│ Settlements · Notifications · Support · Audit · Users     │
└───────────────────────────┬───────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   Database              Payments            3rd-party
 (see DATABASE.md)       Gateway          (Maps/GPS, SMS,
                                            Notifications)
```

`packages/` sits alongside all frontends — shared TypeScript types, API clients, UI components, i18n, and config are reused by customer, partner, vendor, and admin surfaces.

## 2. Monorepo Layout

```
quickbasket/
├── apps/
│   ├── customer-web/       # Customer-facing Next.js app
│   ├── customer-mobile/    # Customer Android/iOS Expo app
│   ├── partner-mobile/     # Delivery-partner Android/iOS Expo app
│   ├── vendor-web/         # Vendor web/PWA
│   ├── vendor-mobile/      # Vendor Android/iOS Expo app
│   └── admin-web/           # Admin operations web app
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
│   ├── api-client/      # typed API client and auth/error handling
│   ├── i18n/            # English/Hindi translations and formatting
│   └── config/          # shared eslint/tsconfig/tailwind config
└── docs/
```

**Rule:** a new top-level folder under `apps/`, `backend/`, or `packages/` is an architecture decision — log it in `DECISIONS.md` before an agent creates it.

## 3. Frontend (`apps/web`)

- **Framework:** Next.js, App Router.
- **Rendering:** server-rendered where it helps SEO/first-load speed (homepage, store/product pages); client-rendered for interactive bits (cart, checkout).
- **i18n:** English + Hindi from day one — all user-facing strings go through the i18n layer, never hardcoded.
- **State:** local/component state by default; a lightweight global store only for cart/session — avoid over-engineering state management before there's a reason to.
- **Khata Module:** Neighborhood credit ledger feature with screens for phone entry, OTP verification, khata overview, shop linking, customer/merchant views, and transaction logging.
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
- Payment is online-only at launch. The gateway is implemented behind a swappable adapter; COD is disabled unless a later decision enables it.
- Webhook-driven payment and order status updates happen server-side only, never trusted from the client.
- Payment attempts and webhook event IDs are persisted for idempotency and reconciliation.

## 9. Notifications

- Order status changes trigger notifications through push first, with SMS/WhatsApp as configurable fallback channels.
- OTP delivery is a first-class notification use case and must be rate-limited.
- Kept as a thin, swappable module so the channel can change without touching order logic.

## 10. Environments

- **Local:** developer machine, `.env.local`.
- **Staging:** mirrors production, used for testing features from the `staging` branch before merge to `main`.
- **Production:** live customer-facing environment, deployed from `main` only.

## 11. What's Deliberately Not Decided Yet

To avoid over-building ahead of real needs, these are intentionally open until Phase 1 usage tells us more:
- Whether Food/Laundry/Porter become separate backend deployables or stay modules in the same backend.
- Whether a dedicated search service is ever needed.
- Advanced dispatch optimization and exact external delivery-provider integrations — the launch supports both managed and third-party partners behind one delivery-job interface.
- Exact payment, OTP, maps, SMS/WhatsApp providers — adapters are required, but provider credentials and contracts remain deployment configuration.

Track these in `notes.md` until they're resolved, then move the resolution here and into `DECISIONS.md`.
