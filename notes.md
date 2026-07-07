# Notes — Founder's Scratchpad

Not official docs. This is where half-formed ideas, open questions, and "come back to this" items live before they graduate into `docs/DECISIONS.md`, `docs/ROADMAP.md`, or `docs/TASKS.md`.

## Open Questions

- [ ] Which city launches first — confirm Lucknow as city #1?
- [ ] Grocery sourcing model: partner with existing local kirana/grocery stores (marketplace model) vs. QuickBasket-owned dark store? Affects `DATABASE.md` store model and `ARCHITECTURE.md` inventory design.
- [ ] Payment gateway shortlist — Razorpay vs. others. Need pricing/settlement comparison before locking in `API_SPEC.md`.
- [ ] Delivery fleet: in-house riders vs. on-demand delivery partner network (day one)?
- [ ] Minimum order value / delivery fee logic — flat fee, distance-based, or free above a threshold?
- [ ] Laundry & Porter — do we build these in-house or partner with existing local service providers and just provide the booking layer?
- [ ] App name lock: "QuickBasket" — check trademark / domain / Play Store name availability before heavy branding investment.

## Ideas Parking Lot

- Loyalty/rewards across all four services (one wallet, one points system) — similar in spirit to Spice & Chutney's coins/loyalty system.
- WhatsApp-based order updates for customers who don't want push notifications.
- "Rotating offers" banner on homepage — should pull from a simple offers/promotions table so non-technical team members can update banners without a code deploy.
- Vendor-facing lightweight dashboard (separate app in `apps/`) so store owners can mark items out of stock.

## Things to Revisit Once We Have Real Users

- Search ranking (distance vs. rating vs. sponsored placement).
- Multi-language beyond English/Hindi (regional languages) — only if data shows demand.
- Subscription/membership tier (free delivery, priority support) — post-MVP.

## Reminders to Self

- Keep `docs/DECISIONS.md` updated every time a "let's just go with X" conversation happens with ChatGPT — otherwise OpenCode/Cline sessions drift out of sync with each other.
- Don't let agents invent new folders under `apps/` or `packages/` without it showing up in `docs/ARCHITECTURE.md` first.
