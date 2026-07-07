"use client";

import { products } from "../../../lib/mock/products";
import { useCart } from "../../contexts/CartContext";
import { QuantitySelector } from "../cart/QuantitySelector";
import Link from "next/link";

export function BoughtTogether({ productIds }: { productIds: string[] }) {
  const { items, addItem, increaseQuantity, decreaseQuantity } = useCart();
  const bought = productIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  if (bought.length === 0) return null;

  return (
    <section>
      <h2 className="text-base font-bold text-gray-900">Frequently Bought Together</h2>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {bought.map((p) => {
          if (!p) return null;
          const cartItem = items.find((i) => i.product.id === p.id);
          const hasDiscount = p.originalPrice && p.originalPrice > p.price;

          return (
            <div
              key={p.id}
              className="w-44 shrink-0 rounded-card border border-gray-100 bg-white p-3 shadow-sm"
            >
              <Link href={`/product/${p.id}`}>
                <div
                  className={`flex h-20 items-center justify-center rounded-lg bg-gradient-to-br ${p.image}`}
                >
                  {p.isVeg && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-green-600 bg-white">
                      <span className="h-2 w-2 rounded-full bg-green-600" />
                    </span>
                  )}
                </div>
                <h4 className="mt-2 truncate text-sm font-semibold text-gray-900">
                  {p.name}
                </h4>
                <p className="text-xs text-gray-400">{p.unit}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-sm font-bold text-gray-900">₹{p.price}</span>
                  {hasDiscount && (
                    <span className="text-xs text-gray-400 line-through">₹{p.originalPrice}</span>
                  )}
                </div>
              </Link>
              <div className="mt-2">
                {cartItem ? (
                  <QuantitySelector
                    quantity={cartItem.quantity}
                    onIncrease={() => increaseQuantity(p.id)}
                    onDecrease={() => decreaseQuantity(p.id)}
                    size="sm"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => addItem(p)}
                    className="flex h-7 w-full items-center justify-center rounded-button bg-brand-50 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-500 hover:text-white"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
