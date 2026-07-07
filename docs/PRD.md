# Product Requirements Document — QuickBasket

## 1. Problem Statement

People juggle separate apps for grocery, food, laundry, and small local errands, and most delivery apps are built city-wide rather than truly neighbourhood-aware — so "what's actually near me right now" is a weak experience. Smaller cities are also underserved by the big national platforms.

## 2. Vision

One app, one account, one order-tracking experience — covering Grocery, Food, Laundry, and Porter (local pickup/drop) — built neighbourhood-first and multi-city from day one.

## 3. Target Users

- **Primary:** Urban/semi-urban customers (students, working professionals, families) who want fast, local delivery without app-switching.
- **Secondary:** Local stores and small businesses who want an online storefront without building their own tech or logistics.

## 4. Scope

### Phase 1 — Grocery (current focus)
In scope for MVP:
- Location: GPS detection + manual address entry.
- Product & store search.
- Browse categories, view store, view product.
- Cart, checkout, basic order tracking.
- Multiple payment methods.
- Rotating offers/promotions on homepage.
- English + Hindi language toggle.

Out of scope for MVP:
- Subscriptions/membership tiers.
- Loyalty/rewards points (parked — see `notes.md`).
- Vendor self-serve dashboard (store owners manage inventory) — planned but not MVP-blocking.

### Phase 2 — Food
Restaurant discovery and ordering on the same delivery backbone as Grocery.

### Phase 3 — Laundry
Pickup/drop scheduling against a service provider network.

### Phase 4 — Porter
On-demand local pickup/drop and small logistics jobs.

See `ROADMAP.md` for sequencing and `TASKS.md` for the live backlog.

## 5. Core Feature Requirements (Phase 1 — Grocery)

### 5.1 Location
- Detect location via GPS with user permission.
- Allow manual address entry/selection as a fallback or preference.
- All content (stores, products, offers) scoped to the resolved city.

### 5.2 Discovery
- Homepage: service grid (Grocery live, others shown as "coming soon"), rotating offers banner, categories, nearby stores.
- Search: products and stores, scoped to the user's city.

### 5.3 Store & Product
- Store page: info, categories, product listing.
- Product page: details, price, availability, add to cart.

### 5.4 Cart & Checkout
- Add/remove/update quantity.
- Apply offers/promotions where applicable.
- Multiple payment methods at checkout.

### 5.5 Orders
- Place order, see confirmation.
- Basic order status tracking (placed → confirmed → out for delivery → delivered, naming to be finalized in `DATABASE.md`).

### 5.6 Account
- Authentication (signup/login).
- Manage saved addresses.
- Order history.

## 6. Non-Functional Requirements

- **Bilingual:** English and Hindi supported from the first release — not retrofitted.
- **Multi-city:** Every entity (store, product, offer, order) is scoped by city; adding a new city should be a data/config change, not a code change.
- **Performance:** Fast perceived load on homepage and search — this is a "quick" basket, the brand promise is speed.
- **Mobile-first:** Majority of usage expected on mobile web/app; design and test mobile first.
- **Accessibility:** Legible type sizes, sufficient color contrast against the Orange theme (see `DESIGN_SYSTEM.md`).

## 7. Success Signals (early, directional — refine once we have real usage data)

- Time from app open to first "add to cart" action.
- % of sessions where a nearby store/product is found without switching city/address.
- Repeat order rate within first 30 days of a user's first order.

## 8. Open Questions

See `notes.md` for the live list (sourcing model, delivery fleet, payment gateway shortlist, etc.) — these materially affect scope and should be resolved before deep-building past MVP.
