"use client";

import type { OrderItem } from "../../../lib/mock/orders";
import { VegMark } from "../ui/VegMark";

export function OrderItems({ items }: { items: OrderItem[] }) {
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="font-display text-base font-bold tracking-tight text-gray-900">Order Items</h2>
      <div className="mt-2 space-y-2">
        {items.map((item, i) => {
          const hasDiscount =
            item.originalPrice && item.originalPrice > item.price;

          return (
            <div
              key={`${item.productId}-${i}`}
              className="flex gap-3 rounded-card border border-paper-200/70 bg-surface p-3 shadow-soft"
            >
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.image}`}
                aria-hidden="true"
              >
                {item.isVeg && <VegMark size="sm" />}
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-semibold text-gray-900">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500">{item.unit}</p>
                  <div className="mt-1 flex items-baseline gap-1.5 tabular-nums">
                    <span className="font-display text-sm font-bold text-gray-900">
                      ₹{item.price}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
                <span className="shrink-0 font-display text-sm font-bold tabular-nums text-gray-900">
                  x{item.quantity}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
