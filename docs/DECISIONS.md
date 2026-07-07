# Decisions Log — QuickBasket

Every entry follows: **Context → Decision → Consequences → Status**. Newest at the top. This is the one file every AI tool (ChatGPT, OpenCode, Cline, Claude Code) should check before re-deciding something that's already settled.

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
