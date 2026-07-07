"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { Product } from "../../../lib/mock/products";
import { useCart } from "../../contexts/CartContext";
import { QuantitySelector } from "../cart/QuantitySelector";

export function ProductResultCard({ product }: { product: Product }) {
  const { items, addItem, increaseQuantity, decreaseQuantity } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="flex items-center gap-4 rounded-card border border-gray-100 bg-white p-3 shadow-sm transition-all hover:shadow-md">
      <Link
        href={`/store/${product.storeId}`}
        className={cn(
          "flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
          product.image
        )}
        aria-hidden="true"
      >
        {product.isVeg && (
          <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-green-600 bg-white">
            <span className="h-2 w-2 rounded-full bg-green-600" />
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <Link href={`/store/${product.storeId}`} className="min-w-0">
          <h4 className="truncate text-sm font-semibold text-gray-900">
            {product.name}
          </h4>
          <p className="mt-0.5 text-xs text-gray-400">{product.unit}</p>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
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
            className="flex h-8 shrink-0 items-center gap-1 rounded-button bg-brand-50 px-3 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-500 hover:text-white"
          >
            <Plus size={14} />
            Add
          </button>
        )}
      </div>
    </div>
  );
}
