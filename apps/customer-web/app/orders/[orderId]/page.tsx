"use client";

import { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Construction,
  CreditCard,
  MapPin,
  MessageSquare,
  ShoppingBag,
  Store,
} from "lucide-react";
import { getOrderById } from "../../../lib/mock/orders";
import { useCart } from "../../contexts/CartContext";
import { OrderTimeline } from "../../components/orders/OrderTimeline";
import { DeliveryPartnerCard } from "../../components/orders/DeliveryPartnerCard";
import { OrderItems } from "../../components/orders/OrderItems";
import { OrderSummary } from "../../components/orders/OrderSummary";
import { OrderMapPlaceholder } from "../../components/orders/OrderMapPlaceholder";
import { SupportActions } from "../../components/orders/SupportActions";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const order = getOrderById(orderId);

  const handleReorder = useCallback(() => {
    if (!order) return;
    router.push(`/store/${order.storeId}`);
  }, [order, router]);

  if (!order) {
    return (
      <div className="hero-wash flex min-h-screen flex-col items-center justify-center px-4">
        <EmptyState
          icon={Construction}
          title="Order not found"
          description="The order you're looking for doesn't exist."
          action={
            <Link href="/orders">
              <Button variant="outline">View All Orders</Button>
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
            href="/orders"
            aria-label="Back to orders"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-paper-200/70"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-display text-base font-bold tracking-tight text-gray-900">Order Details</h1>
          <span className="ml-auto text-xs font-semibold tabular-nums text-gray-500">{order.id}</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Status Banner */}
        <div className="mb-6 rounded-card bg-gradient-to-br from-brand-500 to-brand-700 p-4 text-paper-50 shadow-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/75">Order Status</p>
              <p className="font-display text-lg font-extrabold tracking-tight">
                {order.status === "active"
                  ? "In Progress"
                  : order.status === "completed"
                  ? "Delivered"
                  : "Cancelled"}
              </p>
            </div>
            <ShoppingBag size={24} className="text-white/60" />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Left — Timeline + Partner + Map */}
          <div className="flex-1 space-y-6">
            <section>
              <h2 className="font-display text-base font-bold tracking-tight text-gray-900">Order Timeline</h2>
              <div className="mt-2 rounded-card border border-paper-200/70 bg-surface p-4 shadow-soft">
                <OrderTimeline
                  currentStep={
                    order.status === "cancelled" ? "placed" : order.timelineStep
                  }
                />
              </div>
            </section>

            {order.partner && (
              <DeliveryPartnerCard partner={order.partner} />
            )}

            {order.status === "active" && <OrderMapPlaceholder />}
          </div>

          {/* Right — Info + Items + Summary */}
          <div className="w-full shrink-0 lg:w-80">
            <div className="space-y-4 lg:sticky lg:top-20">
              {/* Order Info */}
              <section>
                <h2 className="font-display text-base font-bold tracking-tight text-gray-900">
                  Order Information
                </h2>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-3 rounded-card border border-paper-200/70 bg-surface p-3 shadow-soft">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                      <Store size={15} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Store</p>
                      <Link
                        href={`/store/${order.storeId}`}
                        className="text-sm font-semibold text-gray-900 transition-colors hover:text-brand-700"
                      >
                        {order.storeName}
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-card border border-paper-200/70 bg-surface p-3 shadow-soft">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-info/10 text-info">
                      <Calendar size={15} />
                    </span>
                    <div>
                      <p className="text-xs text-gray-500">Order Date</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {order.orderDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-card border border-paper-200/70 bg-surface p-3 shadow-soft">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-turmeric-100 text-turmeric-700">
                      <MapPin size={15} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Delivery Address</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {order.deliveryAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-card border border-paper-200/70 bg-surface p-3 shadow-soft">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                      <CreditCard size={15} />
                    </span>
                    <div>
                      <p className="text-xs text-gray-500">Payment</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {order.paymentMethod}
                      </p>
                    </div>
                  </div>

                  {order.deliveryNotes && (
                    <div className="flex items-start gap-3 rounded-card border border-paper-200/70 bg-surface p-3 shadow-soft">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper-100 text-gray-600">
                        <MessageSquare size={15} />
                      </span>
                      <div>
                        <p className="text-xs text-gray-500">Delivery Notes</p>
                        <p className="text-sm text-gray-900">
                          {order.deliveryNotes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <OrderItems items={order.items} />
              <OrderSummary order={order} />
              <SupportActions hasPartner={!!order.partner} />

              {order.status !== "cancelled" && (
                <button
                  type="button"
                  onClick={handleReorder}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-button bg-brand-600 font-display text-sm font-bold text-paper-50 shadow-[0_3px_12px_-3px_rgb(18_50_30/0.5)] transition-all duration-200 hover:bg-brand-700 active:scale-[0.99]"
                >
                  <ShoppingBag size={16} />
                  Reorder from {order.storeName}
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
