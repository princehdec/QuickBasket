"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useCheckout } from "../../contexts/CheckoutContext";
import { useLang } from "../../i18n/LanguageContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type OrderResponse = {
  id: string;
  orderNumber: string;
  createdAt: string;
};
type CreateOrderResponse = { data?: OrderResponse; message?: string };
type PaymentResponse = { data?: { paymentId: string; gatewayOrderId: string; provider: "razorpay"; checkoutPayload: { keyId: string; orderId: string; amount: string; currency: string } }; message?: string };

type RazorpayResult = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayOptions = { key: string; order_id: string; amount: string; currency: string; name: string; description: string; handler: (result: RazorpayResult) => void; modal: { ondismiss: () => void } };
declare global { interface Window { Razorpay?: new (options: RazorpayOptions) => { open: () => void } } }

function getAccessToken(): string | null { return typeof window === "undefined" ? null : window.localStorage.getItem("qb_access_token"); }

function loadRazorpay(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay checkout could not load."));
    document.body.appendChild(script);
  });
}

export function PlaceOrderButton() {
  const { t } = useLang();
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { canPlaceOrder, setLastOrder, selectedAddress, paymentMethod, orderNotes } = useCheckout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePlaceOrder = async () => {
    if (!canPlaceOrder || !selectedAddress || !paymentMethod) { setError(t("Please select a delivery address and payment method.")); return; }
    const accessToken = getAccessToken();
    if (!accessToken) { setError(t("Please verify your phone number before placing an order.")); return; }
    const businessId = items[0]?.product.businessId;
    if (!businessId || items.some((item) => item.product.businessId !== businessId)) { setError(t("Please order from one store at a time.")); return; }

    setLoading(true); setError("");
    try {
      const orderResponse = await fetch(`${API_BASE_URL}/api/v1/orders`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` }, body: JSON.stringify({ businessId, addressId: selectedAddress.id, paymentMethod, deliveryNotes: orderNotes || undefined, items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })) }) });
      const orderPayload = await orderResponse.json() as CreateOrderResponse;
      if (!orderResponse.ok || !orderPayload.data) throw new Error(orderPayload.message ?? t("We could not place your order."));

      const paymentResponse = await fetch(`${API_BASE_URL}/api/v1/payments/create`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` }, body: JSON.stringify({ orderId: orderPayload.data.id, method: paymentMethod }) });
      const paymentPayload = await paymentResponse.json() as PaymentResponse;
      if (!paymentResponse.ok || !paymentPayload.data) throw new Error(paymentPayload.message ?? t("We could not start online payment."));
      await loadRazorpay();
      if (!window.Razorpay) throw new Error(t("Razorpay checkout is unavailable."));

      new window.Razorpay({ key: paymentPayload.data.checkoutPayload.keyId, order_id: paymentPayload.data.checkoutPayload.orderId, amount: paymentPayload.data.checkoutPayload.amount, currency: paymentPayload.data.checkoutPayload.currency, name: "QuickBasket", description: `Payment for ${orderPayload.data.orderNumber}`, handler: async (result) => {
        try {
          const verifyResponse = await fetch(`${API_BASE_URL}/api/v1/payments/verify`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` }, body: JSON.stringify({ orderId: orderPayload.data!.id, razorpayOrderId: result.razorpay_order_id, razorpayPaymentId: result.razorpay_payment_id, razorpaySignature: result.razorpay_signature }) });
          const verifyPayload = await verifyResponse.json() as { message?: string };
          if (!verifyResponse.ok) throw new Error(verifyPayload.message ?? t("Payment verification failed."));
          setLastOrder({ orderId: orderPayload.data!.orderNumber, estimatedDelivery: "Based on live serviceability" });
          clearCart();
          router.push("/order/success");
        } catch (verificationError) { setError(verificationError instanceof Error ? verificationError.message : t("Payment verification failed.")); setLoading(false); }
      }, modal: { ondismiss: () => setLoading(false) } }).open();
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : t("We could not place your order.")); setLoading(false); }
  };

  return <div className="space-y-2"><button type="button" onClick={handlePlaceOrder} disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-button bg-brand-600 font-display text-sm font-bold text-paper-50 shadow-[0_3px_12px_-3px_rgb(18_50_30/0.5)] transition-all duration-200 hover:bg-brand-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">{loading ? <><Loader2 size={18} className="animate-spin" />{t("Opening Payment...")}</> : <><ShoppingBag size={18} />{t("Pay & Place Order")}</>}</button>{error && <p className="text-center text-xs font-medium text-error">{error}</p>}<p className="text-center text-xs text-gray-500">{t("Payment is online-only at launch. By placing this order, you agree to our Terms of Service")}</p></div>;
}
