"use client";

import { Smartphone, CreditCard, Banknote, Landmark } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useCheckout, type PaymentMethod } from "../../contexts/CheckoutContext";

const methods: {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: typeof Smartphone;
}[] = [
  { id: "upi", label: "UPI", description: "Google Pay, PhonePe, Paytm", icon: Smartphone },
  { id: "credit_card", label: "Credit Card", description: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "debit_card", label: "Debit Card", description: "Visa, Mastercard, RuPay", icon: Landmark },
  { id: "cod", label: "Cash on Delivery", description: "Pay when you receive", icon: Banknote },
];

export function PaymentMethods() {
  const { paymentMethod, setPaymentMethod } = useCheckout();

  return (
    <section>
      <h2 className="font-display text-base font-bold tracking-tight text-gray-900">Payment Method</h2>
      <div className="mt-2 space-y-2">
        {methods.map((m) => {
          const Icon = m.icon;
          const isSelected = paymentMethod === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setPaymentMethod(m.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-card border bg-surface p-4 text-left shadow-soft transition-all",
                isSelected
                  ? "border-brand-300 ring-1 ring-brand-200"
                  : "border-paper-200/70 hover:border-paper-300"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
                  isSelected
                    ? "bg-brand-600 text-paper-50"
                    : "bg-paper-100 text-gray-600"
                )}
              >
                <Icon size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-semibold text-gray-900">
                  {m.label}
                </span>
                <p className="mt-0.5 text-xs text-gray-600">{m.description}</p>
              </div>
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isSelected
                    ? "border-brand-600 bg-brand-600"
                    : "border-paper-300"
                )}
              >
                {isSelected && <span className="h-2 w-2 rounded-full bg-paper-50" />}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
