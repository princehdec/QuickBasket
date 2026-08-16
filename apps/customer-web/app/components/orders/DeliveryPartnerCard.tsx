"use client";

import { Bike, Phone, User } from "lucide-react";
import type { DeliveryPartner } from "../../../lib/mock/orders";

export function DeliveryPartnerCard({
  partner,
}: {
  partner: DeliveryPartner;
}) {
  return (
    <section>
      <h2 className="font-display text-base font-bold tracking-tight text-gray-900">Delivery Partner</h2>
      <div className="mt-2 rounded-card border border-paper-200/70 bg-surface p-4 shadow-soft">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <User size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900">{partner.name}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs tabular-nums text-gray-600">
              <Phone size={12} />
              {partner.phone}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-600">
              <Bike size={12} />
              {partner.vehicle}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold tabular-nums text-brand-800">
            {partner.eta}
          </span>
        </div>
      </div>
    </section>
  );
}
