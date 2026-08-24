# Decisions Log — QuickBasket

Every entry follows: **Context → Decision → Consequences → Status**. Newest at the top. This is the one file every AI tool (ChatGPT, OpenCode, Cline, Claude Code) should check before re-deciding something that's already settled.

---

## ADR-015: Brevo HTTPS API for Test-Inbox OTP Delivery

**Context:** The founder selected a fixed test inbox for OTP testing. Render Free blocks outbound SMTP ports and the live service timed out on both the configured SMTP route and Brevo's alternate port, so SMTP cannot be the current delivery transport.

**Decision:** Use Brevo's HTTPS transactional email API from the backend, authenticated with a dedicated server-side Brevo API key stored only in deployment secrets. Keep the existing SMTP adapter as an inactive fallback until it is explicitly removed. Brevo MCP may be used for assistant-side Brevo account inspection and operational actions, but it is not the runtime transport for customer OTP requests because the deployed backend cannot depend on the assistant's MCP session.

**Consequences:** Render can send OTP requests over HTTPS without SMTP egress. The test mode still sends every OTP to `OTP_EMAIL_TO`; it does not provide real phone delivery and is not launch-ready. The Brevo API key must never be committed, logged, or exposed to the browser. A future production launch still needs phone-capable OTP delivery and appropriate abuse controls.

**Status:** Verified for fixed-inbox testing on 24 Aug 2026. Render returned HTTP 200 for the OTP request, logged delivery completion, and Brevo recorded the message as Sent and Delivered. This remains test-only and is not launch-ready phone OTP.

---

## ADR-014: Fixed-Inbox SMTP OTP for Testing

**Context:** The founder selected phone OTP as the launch authentication method, but the current test phase needs a real delivery channel without yet committing to an SMS vendor or spending on live messaging.

**Decision:** Use a swappable SMTP adapter that sends every test OTP to one configured fixed inbox. The OTP code remains redacted from logs and is never returned by the API unless an explicitly enabled non-production test flag is used. This channel is for testing only; it is not sufficient for public customer login because the login request still identifies customers by phone number.

**Consequences:** Testing requires `OTP_PROVIDER=email`, SMTP settings, `OTP_EMAIL_FROM`, and `OTP_EMAIL_TO` in deployment configuration. A production launch still requires a phone-capable SMS provider, rate limiting, delivery monitoring, and provider credentials stored outside source control.

**Status:** Accepted for testing; not launch-ready.

---

## ADR-013: Launch Cities, Serviceability, and Delivery Supply

**Context:** The founder selected Lucknow and Gopalganj as the first launch locations and wants both managed/in-house riders and third-party delivery partners.

**Decision:** Launch initially through configurable service zones rather than the full municipal areas. Use a 5 km default delivery radius from each active business, with an admin-controlled extension up to 8 km for selected businesses when delivery time and partner availability support it. Use business-specific zones, operating hours, road-distance/serviceability checks, and partner capacity rather than relying only on straight-line distance. Support both managed/in-house partners and approved third-party delivery partners through one delivery-job interface.

**Consequences:** The system must support city records, business service areas, delivery fee bands, partner source/type, assignment, reassignment, and zone pause controls. Lucknow should begin with selected neighbourhood clusters; Gopalganj should begin with the central town and nearby localities. Radius values remain configurable and are not hardcoded.

**Status:** Accepted.

---

## ADR-012: Launch Authentication and Payments

**Context:** The founder wants OTP login and does not want COD at launch.

**Decision:** Phone OTP is the primary authentication method. Launch payments are online-only through a payment gateway adapter; COD is disabled by default and can only be enabled later by an explicit admin/product decision. OTP issuance and verification must be rate-limited, auditable, and never logged in plaintext. Payment success must be confirmed server-side through signed gateway verification/webhooks.

**Consequences:** The current password-first backend auth flow must be migrated or made compatible with OTP sessions before launch. Customer, vendor, partner, and admin roles must use the same identity foundation with role-specific authorization.

**Status:** Accepted.

---

## ADR-011: Vendor Settlement and Vendor Surfaces

**Context:** The founder requires a one-week settlement cycle and wants vendor access on both web and mobile.

**Decision:** Merchant settlement is weekly, calculated from an auditable ledger that accounts for commissions, refunds, adjustments, payment fees, and completed-order eligibility. Build both a responsive vendor web/PWA and a native vendor mobile app, backed by the same APIs and permission model.

**Consequences:** The data model needs vendor ledgers, settlement batches, payout status, bank/UPI details, staff roles, and reconciliation reports. The web and mobile vendor products must not duplicate business logic.

**Status:** Accepted.

---

## ADR-010: All Requested Commerce Categories in the Product Scope

**Context:** The founder wants the launch product to support general stores, medicines, electronics, stationery, dry cleaners, bakeries, restaurants, small shops, and cloth/garment shops rather than limiting the plan to grocery only.

**Decision:** The platform will use a shared commerce backbone with category-specific modules. The pilot may be operationally staged by city and merchant readiness, but the product architecture must support all named categories. Medicines must support both OTC and prescription workflows, including pharmacy verification, prescription upload, pharmacist review, decision history, and restricted-product controls.

**Consequences:** The platform must not force dry-cleaning, restaurant, Porter, or prescription orders into a simple grocery-only state model. Category-specific fields and state transitions must be modeled as extensions of a shared order/event framework.

**Status:** Accepted.

---

## ADR-008: Adopt the "Kirana Modern" Design Language

**Context:** The app shipped with a draft orange-on-gray theme that read as generic quick-commerce, and the Khata feature had a second, contradictory teal/paper spec plus an unstyled dead prototype. A full visual redesign was commissioned with creative freedom but zero functional changes.

**Decision:** One design language for the whole product — warm paper surfaces, deep bottle green as the primary, turmeric reserved for offers, and khata red reserved for the credit ledger. Typography is Baloo 2 (display) + Mukta (body), both Ek Type and Devanagari-capable so Hindi works without another font swap. Icons stay Lucide per ADR-003. All tokens live in `apps/customer-web/app/globals.css` (`@theme`); this supersedes the orange draft in the previous `DESIGN_SYSTEM.md` and the palette reference in ADR-007. The previously unrouted Khata prototype was mounted at `/khata` (with one header link) so the feature is reachable — flagged as the only structural addition of the redesign.

**Consequences:** Instantly distinguishable from Blinkit/Zepto/Swiggy clones; colour lanes prevent accent sprawl but require discipline ("is this an offer? turmeric. Is this khata? red."). No dark mode exists yet (future work). Hindi is still untranslated (ADR-006 pending implementation) but fonts are ready.

**Status:** Accepted (design direction selected by founder comparison; visual tuning may continue).

---

## ADR-007: Shared Foundation Packages (Phase 0)

**Context:** Multiple frontend and backend modules need consistent TypeScript types, configuration, and UI components. Duplicating these across modules would lead to drift and maintenance overhead.

**Decision:** Create shared packages in the monorepo:
- `@quickbasket/types`: Shared TypeScript types for User, Store, Product, Category, Cart, Order, Address, Payment
- `@quickbasket/config`: Shared configuration including environment variable schema, constants, API base URLs, feature flags
- `@quickbasket/ui`: Shared UI components using the orange brand theme from DESIGN_SYSTEM.md

**Consequences:**
- Single source of truth for types and configuration
- Consistent UI across all modules
- Easier to maintain and update shared code
- Requires proper TypeScript configuration for module resolution

**Status:** Accepted.

---

## ADR-006: Bilingual (English + Hindi) From Day One

**Context:** Target users span English- and Hindi-comfortable audiences; retrofitting i18n later is expensive.

**Decision:** Every user-facing string ships through an i18n layer supporting English and Hindi from the first release, not added later.

**Consequences:** Slightly more setup cost upfront (i18n plumbing, bilingual content for every screen); avoids a painful retrofit and inconsistent partial-translation later.

**Status:** Accepted.

## ADR-005: Multi-City Architecture From Day One

**Context:** Plan is to launch in one city and expand; retrofitting city-scoping into a single-city data model later is high-risk (easy to leak data across cities, hard to test).

**Decision:** Every catalog/store/order-related table carries `city_id` from the first schema, even though only one city is live at launch. See `DATABASE.md` and `ARCHITECTURE.md`.

**Consequences:** Slightly more schema/query overhead now; expansion to city #2+ becomes a data/config exercise instead of a rebuild.

**Status:** Accepted.

## ADR-004: GPS + Manual Address, Both Supported

**Context:** GPS is convenient but unreliable indoors/patchy signal; manual-only is slower for most users.

**Decision:** Support both — GPS detection as the fast path, manual address entry/search as a fallback and explicit choice.

**Consequences:** Two flows to build and maintain instead of one.

**Status:** Accepted.

## ADR-003: Lucide Icon Set, App-Wide

**Context:** Need one consistent icon language across a multi-service app to avoid visual drift as Food/Laundry/Porter are added.

**Decision:** Use Lucide exclusively for all icons.

**Consequences:** No mixing icon libraries later without a deliberate, documented reason.

**Status:** Accepted.

## ADR-002: Monorepo Structure (`apps/`, `backend/`, `packages/`)

**Context:** Multiple future frontends (customer, admin, vendor) and a growing backend need a structure that scales without duplicating shared code (types, UI, config).

**Decision:** Single monorepo with `apps/` (frontends), `backend/` (API), `packages/` (shared code), `docs/` (documentation).

**Consequences:** One repo to manage; shared code (design system, types) stays in sync automatically instead of drifting across separate repos.

**Status:** Accepted.

## ADR-001: Multi-Service Platform, Grocery First

**Context:** Vision is a single hyperlocal delivery brand across Grocery, Food, Laundry, and Porter, but building all four at once is unrealistic for a solo, non-technical founder relying on AI-assisted development.

**Decision:** Build and ship Grocery completely first (Phase 1), proving the platform, before starting Food (Phase 2), then Laundry (Phase 3), then Porter (Phase 4). Shared backbone: auth, addresses, cart/checkout shape, order tracking, payments.

**Consequences:** Slower time-to-"full platform," but a much lower risk of an unfinished, unstable product across all four services at once.

**Status:** Accepted.

---

## Template for New Entries

```
## ADR-XXX: <Short Title>

**Context:** Why this decision needed to be made.
**Decision:** What was decided.
**Consequences:** Trade-offs, what this rules in/out.
**Status:** Proposed / Accepted / Superseded by ADR-YYY
```

## Open Decisions (not yet made — see `notes.md` for full discussion)

- Payment gateway selection.
- OTP vs. password authentication.
- In-house delivery fleet vs. partner network.
- Grocery sourcing model (marketplace vs. dark store).