"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { CartItem } from "../components/cart/CartItem";
import { CartSummary } from "../components/cart/CartSummary";
import { Button } from "../components/ui/Button";

export default function CartPage() {
  const { items, clearCart, getTotalItems } = useCart();
  const totalItems = getTotalItems();

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8F9FA] px-4 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <ShoppingBag size={36} />
        </span>
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="max-w-xs text-sm text-gray-500">
          Looks like you haven&apos;t added anything yet. Browse stores to find what you need.
        </p>
        <Link href="/stores">
          <Button size="lg">
            <ShoppingBag size={16} />
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="sticky top-0 z-30 border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/stores"
              aria-label="Back to stores"
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-base font-bold text-gray-900">
              Shopping Cart
            </h1>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-red-500"
          >
            <Trash2 size={14} />
            Clear All
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="mb-4 text-sm text-gray-500">
          {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
        </p>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex-1 space-y-3">
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>

          <div className="w-full shrink-0 lg:w-80">
            <div className="lg:sticky lg:top-20">
              <CartSummary />
              <button
                type="button"
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-button bg-brand-500 text-sm font-bold text-white shadow-sm shadow-brand-500/20 transition-colors hover:bg-brand-600"
              >
                Proceed to Checkout
              </button>
              <p className="mt-2 text-center text-xs text-gray-400">
                Checkout integration coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
