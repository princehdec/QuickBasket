# Database — QuickBasket

This is the working schema for Phase 1 (Grocery). Every table that represents catalog or transactional data is scoped by `city_id` to support the multi-city requirement — see `ARCHITECTURE.md`.

Naming convention: tables and columns in `snake_case`, per `PROJECT_RULES.md`.

## Core Tables

### `cities`
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| name | string | e.g. "Lucknow" or "Gopalganj" |
| state | string | e.g. "Uttar Pradesh" or "Bihar" |
| is_active | boolean | can be launched/visible to users |
| created_at | timestamp | |

### `service_zones`
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| city_id | FK → cities | required |
| name | string | neighbourhood cluster or locality name |
| radius_km | decimal | configurable default starts at 5 km; selected zones may extend up to 8 km |
| boundary | geometry/json, nullable | optional polygon for precise serviceability |
| delivery_fee_rules | json | distance-band and service rules |
| is_active | boolean | admin can pause a zone |
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
| store_id | FK → stores | canonical API name may be `business_id` if the live table remains `businesses` |
| city_id | FK → cities | denormalized for fast city-scoped reporting |
| service_zone_id | FK → service_zones | serviceability snapshot |
| address_id | FK → addresses | delivery address |
| status | enum | shared lifecycle extended by category-specific states |
| total_amount | decimal | server-calculated |
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

### `prescription_submissions`
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| customer_id | FK → users | owner of the submission |
| business_id | FK → businesses | pharmacy/business the prescription is intended for |
| document_key | string | trusted object-storage key under the customer's namespace; never an arbitrary public URL |
| document_file_name / document_mime_type | string | review metadata; accepted types are PDF, JPEG, and PNG |
| document_size_bytes | integer | bounded upload metadata; current maximum is 10 MB |
| status | enum | `pending`, `approved`, `rejected`, `expired` |
| reviewer_id | FK → users, nullable | operations reviewer who made the decision |
| rejection_reason | text, nullable | required for rejected submissions |
| expires_at | timestamp | approval validity window; current implementation uses 30 days |
| created_at / updated_at | timestamp | |

### `prescription_submission_items`
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| submission_id | FK → prescription_submissions | |
| product_id | FK → products | prescription-required product covered by the document |
| quantity | integer | maximum quantity covered by the approval |

### `prescription_review_events`
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| submission_id | FK → prescription_submissions | |
| event_type | enum | `submitted`, `approved`, `rejected`, `expired` |
| actor_id | FK → users, nullable | customer or reviewer responsible for the event |
| note | text, nullable | decision context without storing the prescription contents |
| created_at | timestamp | append-only audit timestamp |

`orders` adds nullable `prescription_submission_id` and `prescription_verified_at`. Checkout validates customer ownership, business match, approved status, expiry, and item quantities inside the order transaction before persisting the linkage.

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
| gateway | string | provider behind a swappable adapter |
| gateway_payment_id | string | |
| amount | decimal | |
| status | enum | `pending`, `success`, `failed`, `refunded` |
| webhook_event_id | string, nullable | idempotency key for gateway events |
| created_at | timestamp | |

### `settlement_batches` / `ledger_entries`
Weekly merchant settlement requires immutable ledger entries for order earnings, commission, refunds, adjustments, payment fees, and payout status. A settlement batch belongs to a business and a weekly period; each entry references the source order or adjustment and is never overwritten after payout. Partner earnings use the same ledger pattern with a partner reference.

### `delivery_jobs`
A delivery job references an order, service zone, merchant, customer address, and assigned partner. It records managed versus third-party source, assignment history, pickup/drop timestamps, delivery proof, failure reason, and reassignment events.

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
