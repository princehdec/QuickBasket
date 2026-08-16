"use client";

import { CheckoutProvider } from "../../contexts/CheckoutContext";
import { OrderSuccess } from "../../components/checkout/OrderSuccess";

export default function OrderSuccessPage() {
  return (
    <CheckoutProvider>
      <OrderSuccess />
    </CheckoutProvider>
  );
}
