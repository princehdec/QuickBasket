"use client";

import { useState } from "react";
import { Check, ChevronDown, MapPin, Plus } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useCheckout, mockAddresses } from "../../contexts/CheckoutContext";
import type { Location } from "../../context/LocationContext";

export function AddressCard() {
  const { selectedAddress, setAddress } = useCheckout();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (addr: Location) => {
    setAddress(addr);
    setIsOpen(false);
  };

  return (
    <section>
      <h2 className="font-display text-base font-bold tracking-tight text-gray-900">Delivery Address</h2>

      <div className="mt-2">
        {selectedAddress && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsOpen(!isOpen);
              }
            }}
            className="flex cursor-pointer items-start gap-3 rounded-card border border-paper-200/70 bg-surface p-4 shadow-soft transition-all hover:shadow-lift"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <MapPin size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold text-gray-900">
                  {selectedAddress.label}
                </span>
                {selectedAddress.pincode && (
                  <span className="text-xs tabular-nums text-gray-500">
                    {selectedAddress.pincode}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-gray-600">
                {selectedAddress.address}, {selectedAddress.city}
              </p>
            </div>
            <ChevronDown
              size={18}
              className={cn(
                "mt-1 shrink-0 text-paper-400 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </div>
        )}

        {isOpen && (
          <div className="mt-2 space-y-1.5 rounded-card border border-paper-200/70 bg-surface p-2 shadow-soft">
            {mockAddresses.map((addr) => (
              <button
                key={addr.id}
                type="button"
                onClick={() => handleSelect(addr)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                  selectedAddress?.id === addr.id
                    ? "bg-brand-100"
                    : "hover:bg-paper-100/70"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    selectedAddress?.id === addr.id
                      ? "bg-brand-600 text-paper-50"
                      : "bg-paper-100 text-gray-600"
                  )}
                >
                  <MapPin size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {addr.label}
                  </span>
                  <p className="truncate text-xs text-gray-600">
                    {addr.address}, {addr.city}
                  </p>
                </div>
                {selectedAddress?.id === addr.id && (
                  <Check size={16} className="shrink-0 text-brand-700" />
                )}
              </button>
            ))}
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <Plus size={14} />
              </span>
              Add New Address
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
