"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useCheckout } from "../../contexts/CheckoutContext";
import { useLang } from "../../i18n/LanguageContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type CreateOrderResponse = {
  data?: {
    orderNumber: string;
    grandTotal: number;
    createdAt: string;
  };
  message?: string;
};

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("qb_access_token");
}

export function PlaceOrderButton() {
  const { t } = useLang();
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { canPlaceOrder, setLastOrder, selectedAddress, paymentMethod, orderNotes } = useCheckout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePlaceOrder = async () => {
    if (!canPlaceOrder || !selectedAddress || !paymentMethod) {
      setError(t("Please select a delivery address and payment method."));
      return;
    }

    const accessToken = getAccessToken();
    if (!accessToken) {
      setError(t("Please verify your phone number before placing an order."));
      return;
    }

    const businessId = items[0]?.product.storeId;
    if (!businessId || items.some((item) => item.product.storeId !== businessId)) {
      setError(t("Please order from one store at a time."));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          businessId,
          addressId: selectedAddress.id,
          paymentMethod,
          deliveryNotes: orderNotes || undefined,
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      const payload = (await response.json()) as CreateOrderResponse;
      if (!response.ok || !payload.data) {
        throw new Error(payload.message ?? t("We could not place your order."));
      }

      setLastOrder({
        orderId: payload.data.orderNumber,
        estimatedDelivery: "Based on live serviceability",
      });
      clearCart();
      router.push("/order/success");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t("We could not place your order."));
    } finally {
      setLoading(false);
    }
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
            {t("Placing Order...")}
          </>
        ) : (
          <>
            <ShoppingBag size={18} />
            {t("Pay & Place Order")}
          </>
        )}
      </button>

      {error && <p className="text-center text-xs font-medium text-error">{error}</p>}

      <p className="text-center text-xs text-gray-500">
        {t("Payment is online-only at launch. By placing this order, you agree to our Terms of Service")}
      </p>
    </div>
  );
}
