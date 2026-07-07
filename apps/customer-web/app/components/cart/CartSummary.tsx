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
    <div className="rounded-card border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="text-base font-bold text-gray-900">Bill Summary</h3>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium text-gray-900">₹{subtotal}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Delivery Fee</span>
          <span className={deliveryFee === 0 ? "font-medium text-green-600" : "font-medium text-gray-900"}>
            {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Platform Fee</span>
          <span className="font-medium text-gray-900">₹{platformFee}</span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Discount</span>
            <span className="font-medium text-green-600">-₹{discount}</span>
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between text-base">
          <span className="font-bold text-gray-900">Grand Total</span>
          <span className="font-bold text-gray-900">₹{grandTotal}</span>
        </div>
        {deliveryFee > 0 && (
          <p className="mt-1 text-xs text-gray-400">
            Add items worth ₹{199 - subtotal} more for free delivery
          </p>
        )}
      </div>
    </div>
  );
}
