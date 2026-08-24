"use client";

import Link from "next/link";
import { CheckCircle, Clock, MapPin, Package } from "lucide-react";
import { useCheckout } from "../../contexts/CheckoutContext";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { useLang } from "../../i18n/LanguageContext";

export function OrderSuccess() {
  const { t } = useLang();
  const { lastOrder, selectedAddress } = useCheckout();

  if (!lastOrder) {
    return (
      <div className="hero-wash flex min-h-screen flex-col items-center justify-center px-4">
        <EmptyState
          icon={Package}
          title={t("No order found")}
          description={t("We couldn't find any recent order information.")}
          action={
            <Link href="/stores">
              <Button>Continue Shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 text-center sm:px-6 animate-slide-up">
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-brand-700 ring-4 ring-brand-100/50">
        <CheckCircle size={40} />
      </span>

      <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-gray-900">
        {t("Order Placed Successfully!")}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        {t("Thank you for your order. We'll start preparing it right away.")}
      </p>

      <div className="mt-8 space-y-3 text-left">
        <div className="flex items-center gap-3 rounded-card border border-paper-200/70 bg-surface p-4 shadow-soft">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <Package size={18} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t("Order ID")}</p>
            <p className="font-display text-sm font-bold tabular-nums tracking-wide text-gray-900">
              {lastOrder.orderId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-card border border-paper-200/70 bg-surface p-4 shadow-soft">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-info/10 text-info">
            <Clock size={18} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t("Estimated Delivery")}</p>
            <p className="text-sm font-semibold text-gray-900">
              {lastOrder.estimatedDelivery}
            </p>
          </div>
        </div>

        {selectedAddress && (
          <div className="flex items-center gap-3 rounded-card border border-paper-200/70 bg-surface p-4 shadow-soft">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-turmeric-100 text-turmeric-700">
              <MapPin size={18} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t("Delivering to")}</p>
              <p className="text-sm font-semibold text-gray-900">
                {selectedAddress.label}
              </p>
              <p className="text-xs text-gray-600">
                {selectedAddress.addressLine1}, {selectedAddress.city}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/stores">
          <Button variant="primary" size="lg" className="w-full sm:w-auto">
            {t("Continue Shopping")}
          </Button>
        </Link>
        <span className="text-sm self-center text-gray-500">
          {t("Track Order (coming soon)")}
        </span>
      </div>
    </div>
  );
}
