"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { Product } from "../../../lib/mock/products";
import { useCart } from "../../contexts/CartContext";
import { QuantitySelector } from "../cart/QuantitySelector";

export function ProductCard({ product }: { product: Product }) {
  const { items, addItem, increaseQuantity, decreaseQuantity } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div
      className={cn(
        "group relative rounded-card border border-gray-100 bg-white p-3 shadow-sm transition-all hover:shadow-md hover:border-gray-200",
        product.isBestseller && "ring-1 ring-amber-200"
      )}
    >
      {product.isBestseller && (
        <span className="pointer-events-none absolute left-2 top-2 z-10 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-semibold text-white">
          Bestseller
        </span>
      )}

      <Link href={`/product/${product.id}`}>
        <div
          className={cn(
            "relative mb-3 flex h-24 items-center justify-center rounded-lg bg-gradient-to-br",
            product.image
          )}
        >
          {hasDiscount && (
            <span className="pointer-events-none absolute right-1 top-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
              {discountPercent}% OFF
            </span>
          )}
          {product.isVeg && (
            <span
              className="pointer-events-none absolute bottom-1 left-1 flex h-4 w-4 items-center justify-center rounded-sm border border-green-600 bg-white"
              aria-label="Vegetarian"
            >
              <span className="h-2 w-2 rounded-full bg-green-600" />
            </span>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900">{product.name}</h4>
          <p className="mt-0.5 text-xs text-gray-400">{product.unit}</p>

          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
            )}
          </div>
        </div>
      </Link>

      <div className="mt-2">
        {cartItem ? (
          <div className="flex justify-center">
            <QuantitySelector
              quantity={cartItem.quantity}
              onIncrease={() => increaseQuantity(product.id)}
              onDecrease={() => decreaseQuantity(product.id)}
              size="sm"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => addItem(product)}
            aria-label={`Add ${product.name} to cart`}
            className="flex h-8 w-full items-center justify-center gap-1 rounded-button bg-brand-50 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-500 hover:text-white"
          >
            <Plus size={14} />
            Add
          </button>
        )}
      </div>
    </div>
  );
}
