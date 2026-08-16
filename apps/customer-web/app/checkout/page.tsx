"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { CheckoutProvider } from "../contexts/CheckoutContext";
import { CartItem } from "../components/cart/CartItem";
import { AddressCard } from "../components/checkout/AddressCard";
import { DeliveryTime } from "../components/checkout/DeliveryTime";
import { CouponSection } from "../components/checkout/CouponSection";
import { PaymentMethods } from "../components/checkout/PaymentMethods";
import { OrderNotes } from "../components/checkout/OrderNotes";
import { BillSummary } from "../components/checkout/BillSummary";
import { PlaceOrderButton } from "../components/checkout/PlaceOrderButton";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";

function CheckoutContent() {
  const { items, getTotalItems } = useCart();
  const totalItems = getTotalItems();

  if (items.length === 0) {
    return (
      <div className="hero-wash flex min-h-screen flex-col items-center justify-center px-4">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add items to your cart before checking out."
          action={
            <Link href="/stores">
              <Button>Continue Shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-paper-200/80 bg-surface/90 backdrop-blur-md shadow-soft">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            href="/cart"
            aria-label="Back to cart"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-paper-200/70"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-display text-base font-bold tracking-tight text-gray-900">Checkout</h1>
          <span className="ml-auto text-sm font-medium tabular-nums text-gray-600">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Left — Sections */}
          <div className="flex-1 space-y-6">
            <AddressCard />
            <DeliveryTime />

            <section>
              <h2 className="font-display text-base font-bold tracking-tight text-gray-900">Order Items</h2>
              <div className="mt-2 space-y-2">
                {items.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>
            </section>

            <OrderNotes />
          </div>

          {/* Right — Summary */}
          <div className="w-full shrink-0 lg:w-80">
            <div className="space-y-4 lg:sticky lg:top-20">
              <CouponSection />
              <BillSummary />
              <PaymentMethods />
              <PlaceOrderButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  );
}
