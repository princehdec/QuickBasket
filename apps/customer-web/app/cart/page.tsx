"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { CartItem } from "../components/cart/CartItem";
import { CartSummary } from "../components/cart/CartSummary";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";

export default function CartPage() {
  const { items, clearCart, getTotalItems } = useCart();
  const totalItems = getTotalItems();

  if (items.length === 0) {
    return (
      <div className="hero-wash flex min-h-screen flex-col items-center justify-center px-4">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Browse stores to find what you need."
          action={
            <Link href="/stores">
              <Button size="lg">
                <ShoppingBag size={16} />
                Continue Shopping
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-30 border-b border-paper-200/80 bg-surface/90 backdrop-blur-md shadow-soft">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/stores"
              aria-label="Back to stores"
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-paper-200/70"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-display text-base font-bold tracking-tight text-gray-900">
              Shopping Cart
            </h1>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-error"
          >
            <Trash2 size={14} />
            Clear All
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="mb-4 text-sm font-medium text-gray-600">
          {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
        </p>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="stagger flex-1 space-y-3">
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>

          <div className="w-full shrink-0 lg:w-80">
            <div className="lg:sticky lg:top-20">
              <CartSummary />
              <button
                type="button"
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-button bg-brand-600 font-display text-sm font-bold text-paper-50 shadow-[0_3px_12px_-3px_rgb(18_50_30/0.5)] transition-all duration-200 hover:bg-brand-700 active:scale-[0.99]"
              >
                Proceed to Checkout
              </button>
              <p className="mt-2 text-center text-xs text-gray-500">
                Checkout integration coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
