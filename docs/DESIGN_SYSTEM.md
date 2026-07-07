# Design System — QuickBasket

This is the single source of truth for how QuickBasket looks and feels. Every UI-touching agent session should match this instead of inventing new values per screen.

## Brand Direction

Fast, friendly, local. Orange-led, clean, slightly rounded, snappy — never sluggish or heavy. The app should feel like it moves as fast as the brand promise ("Quick").

## Color

| Token | Hex (starting point — adjust to taste, then lock in `DECISIONS.md`) | Usage |
|---|---|---|
| `color-primary` | `#FF6B1A` | Primary orange — CTAs, active states, brand accents |
| `color-primary-dark` | `#E85A0C` | Hover/pressed states |
| `color-primary-light` | `#FFE4D1` | Subtle backgrounds, badges |
| `color-neutral-900` | `#1A1A1A` | Primary text |
| `color-neutral-600` | `#6B6B6B` | Secondary text |
| `color-neutral-100` | `#F5F5F5` | Page background |
| `color-white` | `#FFFFFF` | Cards, surfaces |
| `color-success` | `#2E9E5B` | Order confirmed, in-stock |
| `color-error` | `#D64545` | Errors, out-of-stock |
| `color-warning` | `#E8A33D` | Delays, low stock |

> These are a reasonable starting palette matching "Orange theme, unique design." Treat as draft until the founder signs off, then copy final values into `BRAND_GUIDELINES.md` and `DECISIONS.md`.

## Typography

- One clean, highly legible sans-serif for both English and Hindi (must have solid Devanagari support if Hindi is rendered in-script, not transliterated).
- Scale: `xs / sm / base / lg / xl / 2xl / 3xl` — base = 16px, scale up ~1.25x per step.
- Weight: regular for body, semibold/bold for headings and prices — avoid more than 2 weights per screen.

## Spacing

- 4px base unit. Common steps: 4 / 8 / 12 / 16 / 24 / 32 / 48.
- Consistent card padding (16px mobile, 24px desktop) across store cards, product cards, and order cards.

## Border Radius

- "Slightly rounded" — not pill-shaped, not sharp. Target: 8px for cards/inputs, 12px for larger surfaces (banners, modals), full-round only for avatars/badges/pills (offer tags).

## Motion

- Fast animations: 150–200ms for micro-interactions (button press, add-to-cart), 250–300ms for larger transitions (page/section changes).
- Easing: ease-out for things entering/appearing, ease-in for things leaving.
- Avoid decorative animation that delays the user from completing an action — speed is a brand promise, not just a visual style.

## Icons

- **Lucide** exclusively — don't mix in another icon set for consistency.
- Standard sizes: 16px (inline/small), 20px (default UI), 24px (nav/prominent actions).
- Icons should carry the current text color unless intentionally using `color-primary` for emphasis.

## Core Components (Phase 1 needs)

- **Service grid tile** — icon + label, rounded card, active (Grocery) vs. "coming soon" (Food/Laundry/Porter) visual state.
- **Rotating offers banner** — carousel, auto-advance, swipeable, dots indicator.
- **Category chip** — rounded pill, icon + label, selected/unselected states.
- **Store card** — image, name, rating, distance, category tags.
- **Product card** — image, bilingual name, price, add-to-cart button.
- **Cart item row** — quantity stepper, remove action.
- **Order status tracker** — horizontal or vertical stepper matching `orders.status` values in `DATABASE.md`.

## Responsive Rules

- Mobile-first: design and build for a single-column, thumb-reachable layout first, then expand to desktop/tablet.
- Sticky cart/checkout CTA on mobile product/cart screens so the primary action is always reachable.

## Bilingual Considerations

- Hindi (Devanagari) text can run longer than English for the same meaning — components (buttons, chips, cards) must not assume fixed-width English strings; test both languages before calling a component "done."

## How to Extend This

When Food/Laundry/Porter introduce new component needs (e.g. a scheduling calendar for Laundry), add them here under a new "Phase 2/3/4 Components" section rather than starting a separate design doc — one system, one file, growing over time.
