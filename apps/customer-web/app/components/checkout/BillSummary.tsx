"use client";

import { useCart } from "../../contexts/CartContext";
import { useCheckout } from "../../contexts/CheckoutContext";

export function BillSummary() {
  const { getSubtotal } = useCart();
  const { couponDiscount, couponApplied, couponCode } = useCheckout();
  const subtotal = getSubtotal();

  const deliveryFee = subtotal >= 199 ? 0 : 20;
  const platformFee = 5;
  const taxes = Math.round(subtotal * 0.05);
  const autoDiscount = Math.min(Math.round(subtotal * 0.1), 50);
  const discount = autoDiscount + (couponApplied ? couponDiscount : 0);
  const grandTotal = Math.max(subtotal + deliveryFee + platformFee + taxes - discount, 0);

  return (
    <section>
      <h2 className="font-display text-base font-bold tracking-tight text-gray-900">Bill Summary</h2>
      <div className="mt-2 rounded-card border border-paper-200/70 bg-surface p-5 shadow-soft">
        <div className="space-y-2.5 text-sm tabular-nums">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold text-gray-900">₹{subtotal}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Delivery Fee</span>
            <span className={deliveryFee === 0 ? "font-bold text-brand-700" : "font-semibold text-gray-900"}>
              {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Platform Fee</span>
            <span className="font-semibold text-gray-900">₹{platformFee}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Taxes (GST)</span>
            <span className="font-semibold text-gray-900">₹{taxes}</span>
          </div>
          {autoDiscount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Auto Discount</span>
              <span className="font-bold text-brand-700">-₹{autoDiscount}</span>
            </div>
          )}
          {couponApplied && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Coupon ({couponCode})</span>
              <span className="font-bold text-brand-700">-₹{couponDiscount}</span>
            </div>
          )}
        </div>

        <div className="dashed-rule mt-4 pt-3.5 tabular-nums">
          <div className="flex items-center justify-between text-base">
            <span className="font-display font-bold text-gray-900">Grand Total</span>
            <span className="font-display text-lg font-extrabold text-gray-900">₹{grandTotal}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
