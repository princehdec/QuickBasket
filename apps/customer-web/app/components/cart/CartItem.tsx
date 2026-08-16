"use client";

import { Trash2 } from "lucide-react";
import { useCart, type CartItem as CartItemType } from "../../contexts/CartContext";
import { QuantitySelector } from "./QuantitySelector";
import { VegMark } from "../ui/VegMark";

export function CartItem({ item }: { item: CartItemType }) {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCart();
  const { product, quantity } = item;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="flex gap-4 rounded-card border border-paper-200/70 bg-surface p-4 shadow-soft">
      <div
        className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${product.image}`}
        aria-hidden="true"
      >
        {product.isVeg && <VegMark />}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-gray-900">
                {product.name}
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">{product.unit}</p>
            </div>
            <button
              type="button"
              onClick={() => removeItem(product.id)}
              aria-label={`Remove ${product.name}`}
              className="shrink-0 rounded-full p-1 text-paper-400 transition-colors hover:bg-khata-100 hover:text-khata-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5 tabular-nums">
            <span className="font-display text-sm font-bold text-gray-900">
              ₹{product.price * quantity}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                ₹{(product.originalPrice! * quantity)}
              </span>
            )}
          </div>
          <QuantitySelector
            quantity={quantity}
            onIncrease={() => increaseQuantity(product.id)}
            onDecrease={() => decreaseQuantity(product.id)}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
