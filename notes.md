# Notes — Founder's Scratchpad

Not official docs. This is where half-formed ideas, open questions, and "come back to this" items live before they graduate into `docs/DECISIONS.md`, `docs/ROADMAP.md`, or `docs/TASKS.md`.

## Open Questions

- [x] Launch cities confirmed: Lucknow and Gopalganj, Bihar. Initial serviceability defaults to 5 km per business, configurable up to 8 km for selected zones.
- [ ] Grocery sourcing model: partner with existing local kirana/grocery stores (marketplace model) vs. QuickBasket-owned dark store? Affects `DATABASE.md` store model and `ARCHITECTURE.md` inventory design.
- [ ] Payment gateway provider — online-only at launch; provider still to be selected and configured behind an adapter.
- [x] Delivery fleet: support both managed/in-house riders and approved third-party delivery partners from launch.
- [ ] Minimum order value / delivery fee logic — use configurable distance bands and business/city rules; exact fee values remain to be finalized.
- [ ] Laundry & Porter — launch as partner-enabled service modules first; exact operating model remains to be finalized.
- [ ] App name lock: "QuickBasket" — check trademark / domain / Play Store name availability before heavy branding investment.

## Ideas Parking Lot

- Loyalty/rewards across all four services (one wallet, one points system) — similar in spirit to Spice & Chutney's coins/loyalty system.
- WhatsApp-based order updates for customers who don't want push notifications.
- "Rotating offers" banner on homepage — should pull from a simple offers/promotions table so non-technical team members can update banners without a code deploy.
- [x] Vendor-facing web/PWA and native mobile app are both required; both use the same backend and permission model.
- [ ] Pharmacy workflow: OTC and prescription products are in scope; compliance/provider details must be finalized before public launch.

## Things to Revisit Once We Have Real Users

- Search ranking (distance vs. rating vs. sponsored placement).
- Multi-language beyond English/Hindi (regional languages) — only if data shows demand.
- Subscription/membership tier (free delivery, priority support) — post-MVP.

## Reminders to Self

- Keep `docs/DECISIONS.md` updated every time a "let's just go with X" conversation happens with ChatGPT — otherwise OpenCode/Cline sessions drift out of sync with each other.
- Don't let agents invent new folders under `apps/` or `packages/` without it showing up in `docs/ARCHITECTURE.md` first.
