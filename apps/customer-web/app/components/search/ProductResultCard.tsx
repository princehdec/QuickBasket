"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { Product } from "../../../lib/mock/products";
import { useCart } from "../../contexts/CartContext";
import { QuantitySelector } from "../cart/QuantitySelector";
import { VegMark } from "../ui/VegMark";

export function ProductResultCard({ product }: { product: Product }) {
  const { items, addItem, increaseQuantity, decreaseQuantity } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="flex items-center gap-4 rounded-card border border-paper-200/70 bg-surface p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
      <Link
        href={`/store/${product.storeId}`}
        className={cn(
          "flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br",
          product.image
        )}
        aria-hidden="true"
      >
        {product.isVeg && <VegMark size="sm" />}
      </Link>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <Link href={`/store/${product.storeId}`} className="min-w-0">
          <h4 className="truncate text-sm font-semibold text-gray-900">
            {product.name}
          </h4>
          <p className="mt-0.5 text-xs text-gray-500">{product.unit}</p>
          <div className="mt-1 flex items-baseline gap-1.5 tabular-nums">
            <span className="font-display text-sm font-bold text-gray-900">₹{product.price}</span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
            )}
          </div>
        </Link>

        {cartItem ? (
          <QuantitySelector
            quantity={cartItem.quantity}
            onIncrease={() => increaseQuantity(product.id)}
            onDecrease={() => decreaseQuantity(product.id)}
            size="sm"
          />
        ) : (
          <button
            type="button"
            onClick={() => addItem(product)}
            aria-label={`Add ${product.name} to cart`}
            className="flex h-8 shrink-0 items-center gap-1 rounded-button bg-brand-100 px-3 font-display text-sm font-bold text-brand-800 transition-all duration-150 hover:bg-brand-600 hover:text-paper-50 active:scale-[0.97]"
          >
            <Plus size={14} />
            Add
          </button>
        )}
      </div>
    </div>
  );
}
