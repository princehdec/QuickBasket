# Design System — QuickBasket ("Kirana Modern")

This is the single source of truth for how QuickBasket looks and feels. Every UI-touching agent session should match this instead of inventing new values per screen.

## Brand Direction

Warm, trustworthy, distinctly Indian. The language is called **Kirana Modern**: the neighbourhood kirana shop and the red-cloth **bahi-khata** ledger, rebuilt with modern app ergonomics. Warm paper surfaces instead of cool grays, deep bottle green instead of quick-commerce orange, and a disciplined set of colour lanes so nothing clashes.

## Color Lanes (the important rule)

Each accent has exactly one job. Don't borrow across lanes:

| Lane | Tokens | Used for |
|---|---|---|
| **Brand green** | `brand-50…900` | Commerce: CTAs, links, active states, success/settled |
| **Turmeric** | `turmeric-50…700` | Offers & promotions only: banners, discount tags, coupons, ratings stars |
| **Khata red** | `khata-50…700` | The credit ledger only: balance panels, purchase rails, khata CTAs, errors |
| **Paper** | `paper-50…900` + `surface` | Backgrounds, cards, hairline borders, all neutral text |

## Core Palette

| Token | Hex | Usage |
|---|---|---|
| `background` | `#FBF9F3` | App background (warm paper, with a subtle grain) |
| `surface` | `#FFFDF7` | Cards, headers, sheets |
| `foreground` | `#1E2620` | Primary text (green-tinted ink — never pure black) |
| `brand-500` | `#2F8144` | Icons, accents, veg mark |
| `brand-600` | `#236837` | Primary CTAs (white text, AA) |
| `turmeric-400` | `#DC9A2B` | Offer CTAs (ink text), bestseller tags |
| `khata-600` | `#8E2F23` | The bahi-khata red panel, khata CTAs |
| `success` | `#2F8144` | Settled/in-stock (brand family) |
| `error` | `#A83A2C` | Errors (khata family) |
| `warning` | `#C97F1A` | Pending/low-stock (turmeric family) |
| `info` | `#41678A` | Neutral status (active orders, meta icons) |

Full ramps live in `apps/customer-web/app/globals.css` (`@theme`). All `gray-*` and `neutral-*` utilities are overridden to warm-tinted values app-wide — never introduce a cool gray.

Bridge tokens (`--color-primary`, `--color-primary-light`, `--color-primary-dark`, success/error/warning) exist so `@quickbasket/ui`'s shadcn-style class names resolve against this theme inside the Tailwind v4 app.

## Typography

- **Display — Baloo 2** (600/700/800): headings, buttons, prices, amounts. Rounded and warm; from Ek Type, an Indian foundry.
- **Body — Mukta** (400/500/600/700): body copy, labels, meta. Also Ek Type.
- Both load with `latin` + `devanagari` subsets — Hindi copy renders correctly the day i18n lands.
- All ₹ amounts use `tabular-nums` (digits don't shift as numbers change).
- Prices/totals: `font-display font-bold tabular-nums`, ink color. Discounts: turmeric.

## Spacing

- 4px base unit. Common steps: 4 / 8 / 12 / 16 / 24 / 32 / 48.
- Card padding 16px mobile, 20–24px desktop. Bottom padding slightly larger than top on sections (optical balance).

## Border Radius

- Containers rounder than contents: inputs/small controls 10px (`radius-sm`), buttons 12px (`radius-button`), cards 16px (`radius-card`), sheets/modals 20px (`radius-sheet`).
- Full-round reserved for pills, chips, count badges, avatars, icon buttons.

## Shadows & Texture

- Warm ink-tinted, one light source: `shadow-soft` (resting cards), `shadow-lift` (hover, green-tinted), `shadow-sheet` (bottom sheets), `shadow-bar` (fixed bars). Never plain black shadows.
- A near-invisible paper-grain overlay sits on `body::before` (fixed, ~3% opacity).
- Receipt motif: bill summaries use a dashed rule (`dashed-rule`) above the grand total. Khata ledger rows sit on `ruled-paper` (faint horizontal rules).
- `hero-wash`: soft radial green glow at the top of centered/landing pages.

## Motion

- 150ms micro (hover/press), 200ms default, 250–450ms entrances. Ease-out.
- Tactile press: `active:scale-[0.97]` on buttons, `scale-90/95` on steppers.
- Sections cascade in via the `.stagger` utility (children delayed ~45ms apart).
- `prefers-reduced-motion` kills all animation (global block in `globals.css` — keep it).

## Icons

- **Lucide exclusively** (ADR-003). Sizes 14/16/18/20/24. No emoji as icons.
- Rating stars are turmeric, filled. Veg mark = `VegMark` component (green square + dot), never re-inlined.

## Core Components

- **Buttons** — `app/components/ui/Button.tsx`. Variants: `primary` (green), `secondary` (green tint), `tertiary` (surface), `ghost`, `outline`, `accent` (turmeric, offers only), `khata` (red, credit actions only). Display face, bold.
- **Cards** — `Card`/`CardImage`/`CardBody`: surface, hairline paper border, soft shadow, hover lift.
- **Badge** — pill; variants default/accent/offer/khata/success/muted.
- **PageHeader** — the sticky inner-page bar (back button + title + action).
- **EmptyState** — one composed empty moment (dashed ring + tinted circle + icon + display title). Use it everywhere instead of hand-rolling.
- **QuantitySelector** — solid green stepper used everywhere quantities change.
- **Khata chrome** — `khata/ui.tsx`: `KhataHeader`, `KhataTabs` (red underline), `InitialTile`, `khataInputClass`.
- **KhataSummaryCard** — the bahi-khata red panel (the only deep-red surface in the product).
- **KhataLedgerItem** — ruled-paper row; red rail = purchase, green rail = repayment, turmeric = pending.

## Status Colour Map

| State | Colour |
|---|---|
| Open / in stock / delivered / settled | brand green |
| Active order / neutral info | slate `info` |
| Pending / low stock / review needed | turmeric |
| Closed / cancelled / error / overdue credit | khata red |

## Responsive Rules

- Mobile-first, single column → `lg:` two-column with sticky right rail (`lg:sticky lg:top-20`).
- Fixed bottom bars (FloatingCart, StickyPurchaseBar) share `z-40`, `shadow-bar`, frosted surface.
- Store detail sticky stack: InfoBar `h-14 top-0 z-40` + CategoryTabs `top-14 z-30` + sections `scroll-mt-28` + JS scroll offset `-120`. Change these together or scroll-spy breaks.

## Bilingual Considerations

- Baloo 2 + Mukta both render Devanagari. Hindi runs longer than English — no fixed-width assumptions in buttons, chips, or cards.
- When i18n lands, all user-facing strings move to the translation layer (ADR-006); until then copy stays English and frozen.

## How to Extend This

When Food/Laundry/Porter introduce new component needs, add them here under a new "Phase 2/3/4 Components" section rather than starting a separate design doc — one system, one file, growing over time.
