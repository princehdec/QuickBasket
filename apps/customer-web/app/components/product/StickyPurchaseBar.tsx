"use client";

import { useCart } from "../../contexts/CartContext";
import { QuantitySelector } from "../cart/QuantitySelector";
import type { Product } from "../../../lib/mock/products";
import type { ProductDetail } from "../../../lib/mock/productDetails";

export function StickyPurchaseBar({
  product,
  detail,
}: {
  product: Product;
  detail: ProductDetail;
}) {
  const { items, addItem, increaseQuantity, decreaseQuantity } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden">
      <div className="flex h-16 items-center justify-between px-4">
        <div>
          <p className="text-sm text-gray-500">Total Price</p>
          <p className="text-lg font-bold text-gray-900">
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
            className="flex h-10 items-center gap-2 rounded-button bg-brand-500 px-6 text-sm font-bold text-white shadow-sm shadow-brand-500/20 transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
