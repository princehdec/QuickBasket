"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { CustomerProduct } from "../../../lib/api";
import { useCart } from "../../contexts/CartContext";
import { QuantitySelector } from "../cart/QuantitySelector";
import { VegMark } from "../ui/VegMark";
import { useLang } from "../../i18n/LanguageContext";

export function ProductCard({ product }: { product: CustomerProduct }) {
  const { t } = useLang();
  const { items, addItem, increaseQuantity, decreaseQuantity } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div
      className={cn(
        "group relative rounded-card border border-paper-200/70 bg-surface p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift",
        product.isBestseller && "ring-1 ring-turmeric-300"
      )}
    >
      {product.isBestseller && (
        <span className="pointer-events-none absolute left-2 top-2 z-10 rounded-full bg-turmeric-400 px-2 py-0.5 text-[10px] font-bold text-[#33230a]">
          {t("Bestseller")}
        </span>
      )}

      <Link href={`/product/${product.id}`}>
        <div
          className={cn(
            "relative mb-3 flex h-24 items-center justify-center rounded-xl bg-gradient-to-br",
            product.image
          )}
        >
          {hasDiscount && (
            <span className="pointer-events-none absolute right-1 top-1 rounded-full bg-turmeric-500 px-2 py-0.5 text-[10px] font-bold text-white">
              {discountPercent}% {t("OFF")}
            </span>
          )}
          {product.isVeg && (
            <VegMark size="sm" className="absolute bottom-1 left-1" />
          )}
        </div>

        <div>
          <h4 className="truncate text-sm font-semibold text-gray-900">{product.name}</h4>
          <p className="mt-0.5 text-xs text-gray-500">{product.unit}</p>

          <div className="mt-2 flex items-baseline gap-1.5 tabular-nums">
            <span className="font-display text-sm font-bold text-gray-900">₹{product.price}</span>
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
            className="flex h-8 w-full items-center justify-center gap-1 rounded-button bg-brand-100 font-display text-sm font-bold text-brand-800 transition-all duration-150 hover:bg-brand-600 hover:text-paper-50 active:scale-[0.97]"
          >
            <Plus size={14} />
            {t("Add")}
          </button>
        )}
      </div>
    </div>
  );
}
