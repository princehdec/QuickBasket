"use client";

import { Star, Clock, Truck } from "lucide-react";
import type { CustomerProduct } from "../../../lib/api";
import type { ProductDetail } from "../../../lib/mock/productDetails";
import { useCart } from "../../contexts/CartContext";
import { QuantitySelector } from "../cart/QuantitySelector";
import { VegMark } from "../ui/VegMark";
import { useLang } from "../../i18n/LanguageContext";

export function ProductInfo({
  product,
  detail,
}: {
  product: CustomerProduct;
  detail: ProductDetail;
}) {
  const { t } = useLang();
  const { items, addItem, increaseQuantity, decreaseQuantity } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div>
      {detail.brand && (
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-paper-500">
          {t(detail.brand)}
        </p>
      )}

      <div className="mt-2 flex items-start justify-between gap-3">
        <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900">
          {product.name}
        </h1>
        {product.isVeg && <VegMark size="lg" className="mt-1" />}
      </div>

      <p className="mt-1 text-sm text-gray-500">{product.unit}</p>
      {product.requiresPrescription && <p className="mt-2 inline-flex rounded-full bg-khata-100 px-3 py-1 text-xs font-bold text-khata-700">{t("Prescription required / प्रिस्क्रिप्शन आवश्यक")}</p>}

      <div className="mt-3 flex items-center gap-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-0.5 text-sm font-bold tabular-nums text-brand-800">
          <Star size={14} className="fill-turmeric-500 text-turmeric-500" />
          {detail.rating.toFixed(1)}
        </span>
        <span className="text-sm tabular-nums text-gray-600">
          ({detail.reviewsCount} {t("reviews")})
        </span>
      </div>

      <div className="mt-4 flex items-baseline gap-2.5 tabular-nums">
        <span className="font-display text-3xl font-extrabold tracking-tight text-gray-900">
          ₹{product.price}
        </span>
        {hasDiscount && (
          <>
            <span className="text-lg text-paper-400 line-through">
              ₹{product.originalPrice}
            </span>
            <span className="rounded-full bg-turmeric-100 px-2.5 py-0.5 font-display text-sm font-bold text-turmeric-700">
              {discountPercent}% {t("OFF")}
            </span>
          </>
        )}
      </div>

      <div className="mt-4">
        {detail.stockStatus === "out_of_stock" ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-khata-100 px-3 py-1 text-sm font-bold text-khata-700">
            {t("Out of Stock")}
          </span>
        ) : detail.stockStatus === "low_stock" ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-turmeric-100 px-3 py-1 text-sm font-bold text-turmeric-700">
            <Clock size={14} />
            {t("Only")} {detail.stockCount} {t("left")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-sm font-bold text-brand-800">
            <Truck size={14} />
            {t("In Stock")}
          </span>
        )}
      </div>

      <div className="mt-6">
        {cartItem ? (
          <div className="inline-flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">{t("Quantity:")}</span>
            <QuantitySelector
              quantity={cartItem.quantity}
              onIncrease={() => increaseQuantity(product.id)}
              onDecrease={() => decreaseQuantity(product.id)}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => addItem(product)}
            disabled={detail.stockStatus === "out_of_stock" || product.requiresPrescription}
            className="flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-button bg-brand-600 font-display text-sm font-bold text-paper-50 shadow-[0_3px_12px_-3px_rgb(18_50_30/0.5)] transition-all duration-200 hover:bg-brand-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {product.requiresPrescription ? t("Prescription verification required / प्रिस्क्रिप्शन सत्यापन आवश्यक") : `${t("Add to Cart")} — ₹${product.price}`}
          </button>
        )}
      </div>
    </div>
  );
}
