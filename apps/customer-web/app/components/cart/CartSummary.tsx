"use client";

import { useCart } from "../../contexts/CartContext";

export function CartSummary() {
  const { getSubtotal } = useCart();
  const subtotal = getSubtotal();

  const deliveryFee = subtotal >= 199 ? 0 : 20;
  const platformFee = 5;
  const discount = Math.min(Math.round(subtotal * 0.1), 50);
  const grandTotal = subtotal + deliveryFee + platformFee - discount;

  return (
    <div className="rounded-card border border-paper-200/70 bg-surface p-5 shadow-soft">
      <h3 className="font-display text-base font-bold tracking-tight text-gray-900">Bill Summary</h3>

      <div className="mt-4 space-y-2.5 text-sm tabular-nums">
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
        {discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Discount</span>
            <span className="font-bold text-brand-700">-₹{discount}</span>
          </div>
        )}
      </div>

      <div className="dashed-rule mt-4 pt-3.5 tabular-nums">
        <div className="flex items-center justify-between text-base">
          <span className="font-display font-bold text-gray-900">Grand Total</span>
          <span className="font-display text-lg font-extrabold text-gray-900">₹{grandTotal}</span>
        </div>
        {deliveryFee > 0 && (
          <p className="mt-1.5 text-xs text-gray-500">
            Add items worth ₹{199 - subtotal} more for free delivery
          </p>
        )}
      </div>
    </div>
  );
}
