"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useCheckout } from "../../contexts/CheckoutContext";

export function PlaceOrderButton() {
  const router = useRouter();
  const { clearCart } = useCart();
  const { canPlaceOrder, setLastOrder, selectedAddress, deliveryOption } = useCheckout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePlaceOrder = () => {
    if (!canPlaceOrder) {
      setError("Please select a delivery address and payment method.");
      return;
    }

    setLoading(true);
    setError("");

    const orderId = `QB${Array.from({ length: 8 }, () =>
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(
        Math.floor(Math.random() * 36)
      )
    ).join("")}`;

    const estimatedDelivery =
      deliveryOption === "asap"
        ? "20-30 minutes"
        : "Scheduled for selected time";

    setTimeout(() => {
      setLastOrder({ orderId, estimatedDelivery });
      clearCart();
      router.push("/order/success");
    }, 1500);
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handlePlaceOrder}
        disabled={loading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-button bg-brand-600 font-display text-sm font-bold text-paper-50 shadow-[0_3px_12px_-3px_rgb(18_50_30/0.5)] transition-all duration-200 hover:bg-brand-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Placing Order...
          </>
        ) : (
          <>
            <ShoppingBag size={18} />
            Place Order
          </>
        )}
      </button>

      {error && (
        <p className="text-center text-xs font-medium text-error">{error}</p>
      )}

      <p className="text-center text-xs text-gray-500">
        By placing this order, you agree to our Terms of Service
      </p>
    </div>
  );
}
