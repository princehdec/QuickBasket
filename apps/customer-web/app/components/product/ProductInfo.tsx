"use client";

import { Star, Clock, Truck } from "lucide-react";
import type { Product } from "../../../lib/mock/products";
import type { ProductDetail } from "../../../lib/mock/productDetails";
import { useCart } from "../../contexts/CartContext";
import { QuantitySelector } from "../cart/QuantitySelector";

export function ProductInfo({
  product,
  detail,
}: {
  product: Product;
  detail: ProductDetail;
}) {
  const { items, addItem, increaseQuantity, decreaseQuantity } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div>
      {detail.brand && (
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
          {detail.brand}
        </p>
      )}

      <div className="mt-2 flex items-start justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {product.name}
        </h1>
        {product.isVeg && (
          <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 border-green-600">
            <span className="h-3 w-3 rounded-full bg-green-600" />
          </span>
        )}
      </div>

      <p className="mt-1 text-sm text-gray-400">{product.unit}</p>

      <div className="mt-3 flex items-center gap-3">
        <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-0.5 text-sm font-semibold text-green-700">
          <Star size={14} className="fill-green-600 text-green-600" />
          {detail.rating.toFixed(1)}
        </span>
        <span className="text-sm text-gray-500">
          ({detail.reviewsCount} reviews)
        </span>
      </div>

      <div className="mt-4 flex items-baseline gap-2.5">
        <span className="text-3xl font-bold text-gray-900">
          ₹{product.price}
        </span>
        {hasDiscount && (
          <>
            <span className="text-lg text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-sm font-bold text-red-600">
              {discountPercent}% OFF
            </span>
          </>
        )}
      </div>

      <div className="mt-4">
        {detail.stockStatus === "out_of_stock" ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-600">
            Out of Stock
          </span>
        ) : detail.stockStatus === "low_stock" ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-600">
            <Clock size={14} />
            Only {detail.stockCount} left
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-600">
            <Truck size={14} />
            In Stock
          </span>
        )}
      </div>

      <div className="mt-6">
        {cartItem ? (
          <div className="inline-flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Quantity:</span>
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
            disabled={detail.stockStatus === "out_of_stock"}
            className="flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-button bg-brand-500 text-sm font-bold text-white shadow-sm shadow-brand-500/20 transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add to Cart — ₹{product.price}
          </button>
        )}
      </div>
    </div>
  );
}
