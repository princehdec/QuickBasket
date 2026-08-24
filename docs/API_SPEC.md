# API Spec — QuickBasket

REST API, JSON over HTTPS. Base path: `/api/v1`.

## Conventions

**Standard response envelope (success):**
```json
{
  "success": true,
  "data": { },
  "meta": { }
}
```

**Standard response envelope (error):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Human-readable explanation"
  }
}
```

- Auth: Bearer token in `Authorization` header, issued at login.
- All list endpoints support pagination via `?page=` and `?limit=`.
- All catalog/store/order endpoints require a resolved `city_id` — either explicit query param or inferred from the authenticated user's active address.

## Auth

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/signup` | Create account (name, phone, language_pref) |
| POST | `/auth/login` | Start login (send OTP, or password — pending decision) |
| POST | `/auth/verify` | Verify OTP / complete login, returns token |
| POST | `/auth/refresh` | Refresh auth token |
| POST | `/auth/logout` | Invalidate session |

## Users & Addresses

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/users/me` | Current user profile |
| PATCH | `/users/me` | Update profile (name, language_pref) |
| GET | `/users/me/addresses` | List saved addresses |
| POST | `/users/me/addresses` | Add address (GPS coords or manual entry) |
| PATCH | `/users/me/addresses/:id` | Update address |
| DELETE | `/users/me/addresses/:id` | Remove address |
| POST | `/users/me/addresses/:id/default` | Set default address |

## Catalog & Search

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/cities` | List active cities (for manual city selection) |
| GET | `/stores?city_id=&lat=&lng=` | Nearby/list stores for a city |
| GET | `/stores/:id` | Store detail |
| GET | `/stores/:id/products` | Products for a store, filterable by `category_id` |
| GET | `/categories` | Category list (bilingual names) |
| GET | `/products/:id` | Product detail |
| GET | `/search?q=&city_id=&type=products|stores` | Unified search |

## Cart

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/cart` | Current user's active cart |
| POST | `/cart/items` | Add item (`product_id`, `quantity`) |
| PATCH | `/cart/items/:id` | Update quantity |
| DELETE | `/cart/items/:id` | Remove item |
| DELETE | `/cart` | Clear cart |

## Offers

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/offers?city_id=` | Active offers for homepage banner |

## Orders

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/orders` | Place order from current cart (`address_id`, `payment_method`, optional `prescription_submission_id`) |

| GET | `/orders` | Order history for current user |
| GET | `/orders/:id` | Order detail + status |
| GET | `/orders/:id/status` | Lightweight status-only poll, for tracking screen |

## Prescriptions

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/prescriptions/submissions` | Submit a prescription document key and the prescription-required products it covers for review. The document key must be issued by the trusted upload service under the authenticated customer's namespace. |
| GET | `/prescriptions/submissions` | List the authenticated customer's prescription submissions and statuses. |
| GET | `/prescriptions/submissions/:id` | Retrieve one owned submission with linked items and review-event history. |
| GET | `/prescriptions/admin` | Operations review queue of pending submissions. |
| PATCH | `/prescriptions/admin/:id` | Approve or reject a pending submission; rejection requires a reason and every decision creates an audit event. |

Prescription-required products remain blocked at checkout unless the order includes an approved, unexpired submission belonging to the customer, for the same business, and covering each requested product and quantity. The current implementation accepts storage metadata but does not yet provide the production upload adapter.

## Payments

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/payments/initiate` | Start payment for an order, returns gateway session/redirect info |
| POST | `/payments/webhook` | **Server-to-server only.** Gateway calls this to confirm payment status. Never trust a client-side "payment success" alone — order confirmation is driven by this webhook. |

## Error Codes (starting set — extend as needed, keep this list in sync with backend)

| Code | Meaning |
|---|---|
| `INVALID_INPUT` | Request failed validation |
| `UNAUTHORIZED` | Missing/invalid auth token |
| `NOT_FOUND` | Resource doesn't exist |
| `CITY_REQUIRED` | Endpoint needs a resolved city and none was found |
| `OUT_OF_STOCK` | Product unavailable at add-to-cart or checkout time |
| `PAYMENT_FAILED` | Payment gateway reported failure |

## Notes

- Gateway-specific payment fields will be added once the payment gateway decision is locked (see `notes.md` → `DECISIONS.md`).
- Food/Laundry/Porter will extend this spec with their own resource groups once those phases start — keep the auth, users, and orders "shape" consistent so the same client code can largely be reused across services.
