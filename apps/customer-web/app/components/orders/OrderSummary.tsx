"use client";

import type { Order } from "../../../lib/mock/orders";

export function OrderSummary({ order }: { order: Order }) {
  return (
    <section>
      <h2 className="font-display text-base font-bold tracking-tight text-gray-900">Bill Summary</h2>
      <div className="mt-2 rounded-card border border-paper-200/70 bg-surface p-5 shadow-soft">
        <div className="space-y-2.5 text-sm tabular-nums">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold text-gray-900">₹{order.subtotal}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Delivery Fee</span>
            <span className={order.deliveryFee === 0 ? "font-bold text-brand-700" : "font-semibold text-gray-900"}>
              {order.deliveryFee === 0 ? "Free" : `₹${order.deliveryFee}`}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Platform Fee</span>
            <span className="font-semibold text-gray-900">₹{order.platformFee}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Taxes (GST)</span>
            <span className="font-semibold text-gray-900">₹{order.taxes}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Discount</span>
              <span className="font-bold text-brand-700">-₹{order.discount}</span>
            </div>
          )}
          {order.couponCode && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Coupon ({order.couponCode})</span>
              <span className="font-bold text-brand-700">-₹{order.couponDiscount}</span>
            </div>
          )}
        </div>

        <div className="dashed-rule mt-4 pt-3.5 tabular-nums">
          <div className="flex items-center justify-between text-base">
            <span className="font-display font-bold text-gray-900">Grand Total</span>
            <span className="font-display text-lg font-extrabold text-gray-900">₹{order.grandTotal}</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Paid via {order.paymentMethod}
          </p>
        </div>
      </div>
    </section>
  );
}
