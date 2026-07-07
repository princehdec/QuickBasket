# QuickBasket — Project Overview

## Vision

QuickBasket is a multi-service hyperlocal delivery platform. We start with **Grocery**, then layer in **Food**, **Laundry**, and **Porter** (local pickup/drop & logistics) on top of the same app, same account, same order-tracking system. The bet: people don't want five different delivery apps for five different needs in their own neighbourhood — they want one app that knows their location and can get them anything nearby, fast.

## Problem We're Solving

- Existing grocery/food apps are city-first, not neighbourhood-first — discovery of genuinely *nearby* stores is weak.
- Customers juggle multiple apps for grocery, food, laundry, and local errands.
- Smaller cities are underserved by the big national platforms.

## Who It's For

- Urban and semi-urban customers who want fast, local delivery without downloading a different app for every service.
- Local stores and small businesses who want an online storefront without building their own tech.

## Core Modules (in build order)

1. **Grocery** — browse nearby stores, search products, order, track. (Building now.)
2. **Food** — restaurant discovery and ordering, same delivery backbone.
3. **Laundry** — pickup/drop scheduling with a service provider network.
4. **Porter** — on-demand local pickup/drop and small logistics jobs.

## What Makes It Different

- **Multi-city architecture from day one** — every store, product, and order is scoped to a city, so adding city #2 is a config change, not a rebuild.
- **Bilingual** — English and Hindi supported from the first release, not bolted on later.
- **GPS + manual address** — location detection when it's convenient, manual entry when it isn't (patchy GPS, indoor, etc.).
- **One design language across services** — Orange brand, Lucide icons, rounded corners, fast animations — so Food/Laundry/Porter feel like the same app, not acquisitions bolted together.

## Current Status

- Environment ready: Ubuntu (WSL), VS Code Insiders, Node via NVM, Git initialized.
- Customer website scaffolded with Next.js; basic homepage live.
- Full documentation scaffold in place (this file and everything in `/docs`).

## Immediate Next Steps

1. Lock the design system (`docs/DESIGN_SYSTEM.md`).
2. Build the production homepage (service grid, rotating offers banner, categories, nearby stores).
3. Build authentication.
4. Build the Grocery module end-to-end (catalog → cart → order → tracking).

See `docs/ROADMAP.md` for the full phased plan and `docs/TASKS.md` for the live backlog.

## How Decisions Get Made

Anything that changes the product direction, tech stack, or brand gets written down in `docs/DECISIONS.md` — so that Cline, OpenCode, ChatGPT, or Claude Code all read the same source of truth instead of re-deciding things differently each session.
