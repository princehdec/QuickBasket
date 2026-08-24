"use client";

import type { CustomerProduct } from "../../../lib/api";
import { useCart } from "../../contexts/CartContext";
import { QuantitySelector } from "../cart/QuantitySelector";
import { VegMark } from "../ui/VegMark";
import Link from "next/link";
import { useLang } from "../../i18n/LanguageContext";

export function BoughtTogether({ products }: { products: CustomerProduct[] }) {
  const { t } = useLang();
  const { items, addItem, increaseQuantity, decreaseQuantity } = useCart();
  const bought = products;

  if (bought.length === 0) return null;

  return (
    <section>
      <h2 className="font-display text-base font-bold tracking-tight text-gray-900">{t("Frequently Bought Together")}</h2>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {bought.map((p) => {
          if (!p) return null;
          const cartItem = items.find((i) => i.product.id === p.id);
          const hasDiscount = p.originalPrice && p.originalPrice > p.price;

          return (
            <div
              key={p.id}
              className="w-44 shrink-0 rounded-card border border-paper-200/70 bg-surface p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <Link href={`/product/${p.id}`}>
                <div
                  className={`flex h-20 items-center justify-center rounded-xl bg-gradient-to-br ${p.image}`}
                >
                  {p.isVeg && <VegMark size="sm" />}
                </div>
                <h4 className="mt-2 truncate text-sm font-semibold text-gray-900">
                  {p.name}
                </h4>
                <p className="text-xs text-gray-500">{p.unit}</p>
                <div className="mt-1 flex items-baseline gap-1.5 tabular-nums">
                  <span className="font-display text-sm font-bold text-gray-900">₹{p.price}</span>
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
                    className="flex h-7 w-full items-center justify-center rounded-button bg-brand-100 font-display text-xs font-bold text-brand-800 transition-all duration-150 hover:bg-brand-600 hover:text-paper-50 active:scale-[0.97]"
                  >
                    {t("Add")}
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
