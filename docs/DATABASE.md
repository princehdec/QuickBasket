# Database — QuickBasket

This is the working schema for Phase 1 (Grocery). Every table that represents catalog or transactional data is scoped by `city_id` to support the multi-city requirement — see `ARCHITECTURE.md`.

Naming convention: tables and columns in `snake_case`, per `PROJECT_RULES.md`.

## Core Tables

### `cities`
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| name | string | e.g. "Lucknow" |
| state | string | |
| is_active | boolean | can be launched/visible to users |
| created_at | timestamp | |

### `users`
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| name | string | |
| phone | string | unique, primary login identifier (assumption — confirm OTP vs. password in `DECISIONS.md`) |
| email | string, nullable | |
| language_pref | enum | `en` / `hi` |
| created_at | timestamp | |

### `addresses`
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| user_id | FK → users | |
| city_id | FK → cities | |
| label | string | "Home", "Work", etc. |
| line1 / line2 | string | |
| lat / lng | float | for GPS-based addresses |
| is_default | boolean | |

### `stores`
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| city_id | FK → cities | **required** — every store belongs to one city |
| name | string | |
| category | string | grocery type/tags |
| lat / lng | float | for "nearby stores" queries |
| is_active | boolean | |
| rating | float, nullable | |

### `categories`
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| name | string | |
| name_hi | string | Hindi label |
| parent_id | FK → categories, nullable | for subcategories |

### `products`
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| store_id | FK → stores | |
| category_id | FK → categories | |
| name / name_hi | string | bilingual product name |
| description | text, nullable | |
| price | decimal | |
| unit | string | e.g. "500g", "1L" |
| is_available | boolean | |
| image_url | string | |

### `carts` / `cart_items`
| `carts` | | |
|---|---|---|
| id | PK | |
| user_id | FK → users | |
| store_id | FK → stores | a cart is scoped to one store per checkout, typical for grocery |

| `cart_items` | | |
|---|---|---|
| id | PK | |
| cart_id | FK → carts | |
| product_id | FK → products | |
| quantity | integer | |

### `orders`
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| user_id | FK → users | |
| store_id | FK → stores | |
| city_id | FK → cities | denormalized for fast city-scoped reporting |
| address_id | FK → addresses | delivery address |
| status | enum | `placed`, `confirmed`, `out_for_delivery`, `delivered`, `cancelled` (finalize naming as a `DECISIONS.md` entry) |
| total_amount | decimal | |
| payment_id | FK → payments, nullable | |
| created_at | timestamp | |

### `order_items`
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| order_id | FK → orders | |
| product_id | FK → products | |
| quantity | integer | |
| price_at_order | decimal | snapshot price, so later price changes don't rewrite history |

### `order_status_history`
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| order_id | FK → orders | |
| status | enum | same enum as `orders.status` |
| changed_at | timestamp | |

### `payments`
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| order_id | FK → orders | |
| gateway | string | e.g. "razorpay" — pending final decision |
| gateway_payment_id | string | |
| amount | decimal | |
| status | enum | `pending`, `success`, `failed`, `refunded` |
| created_at | timestamp | |

### `offers` / `promotions`
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| city_id | FK → cities, nullable | null = applies everywhere |
| title / title_hi | string | for the rotating homepage banner |
| description | text, nullable | |
| discount_type | enum | `flat`, `percentage` |
| discount_value | decimal | |
| valid_from / valid_to | timestamp | |
| is_active | boolean | |

## Relationships at a Glance

```
cities ──< stores ──< products ──< cart_items >── carts ── users
   │                     │
   │                     └──< order_items >── orders ──< order_status_history
   │                                          │
   └──< offers                                └── payments
users ──< addresses
```

## Indexing Notes (for Phase 1 search/performance)

- `stores`: index on `(city_id, is_active)` and on `(lat, lng)` for nearby-store queries.
- `products`: index on `(store_id, is_available)` and a text index on `(name, name_hi)` for search.
- `orders`: index on `(user_id, created_at)` and `(city_id, status)` for admin/reporting views later.

## Open Schema Questions

- Multi-item carts across multiple stores in one checkout — Phase 1 assumes single-store cart (simpler delivery logic). Revisit if product feedback demands multi-store carts.
- Loyalty/coins system — deliberately not modeled yet (parked in `notes.md`); will need a `wallet`/`ledger`-style table when it's prioritized.
- Vendor accounts (store owners managing their own inventory) — will need a `vendor_users` table linked to `stores` once that dashboard is built.
