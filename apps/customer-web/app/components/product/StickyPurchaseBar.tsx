"use client";

import { useCart } from "../../contexts/CartContext";
import { QuantitySelector } from "../cart/QuantitySelector";
import type { CustomerProduct } from "../../../lib/api";
import type { ProductDetail } from "../../../lib/mock/productDetails";
import { useLang } from "../../i18n/LanguageContext";

export function StickyPurchaseBar({
  product,
  detail,
}: {
  product: CustomerProduct;
  detail: ProductDetail;
}) {
  const { t } = useLang();
  const { items, addItem, increaseQuantity, decreaseQuantity } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-paper-200/80 bg-surface/95 shadow-bar backdrop-blur-md md:hidden">
      <div className="flex h-16 items-center justify-between px-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-paper-500">{t("Total Price")}</p>
          <p className="font-display text-lg font-extrabold tabular-nums text-gray-900">
            ₹{product.price * (cartItem?.quantity ?? 1)}
          </p>
        </div>

        {cartItem ? (
          <QuantitySelector
            quantity={cartItem.quantity}
            onIncrease={() => increaseQuantity(product.id)}
            onDecrease={() => decreaseQuantity(product.id)}
          />
        ) : (
          <button
            type="button"
            onClick={() => addItem(product)}
            disabled={detail.stockStatus === "out_of_stock"}
            className="flex h-10 items-center gap-2 rounded-button bg-brand-600 px-6 font-display text-sm font-bold text-paper-50 shadow-[0_3px_12px_-3px_rgb(18_50_30/0.5)] transition-all duration-200 hover:bg-brand-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("Add to Cart")}
          </button>
        )}
      </div>
    </div>
  );
}
