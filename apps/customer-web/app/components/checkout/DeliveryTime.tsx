"use client";

import { Clock, Calendar } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useCheckout, type DeliveryOption } from "../../contexts/CheckoutContext";

const options: { id: DeliveryOption; label: string; description: string }[] = [
  { id: "asap", label: "Deliver ASAP", description: "In 20-30 minutes" },
  { id: "scheduled", label: "Schedule Delivery", description: "Pick a convenient time" },
];

export function DeliveryTime() {
  const { deliveryOption, setDeliveryOption, scheduledDate, setScheduledDate } = useCheckout();

  return (
    <section>
      <h2 className="font-display text-base font-bold tracking-tight text-gray-900">Delivery Time</h2>
      <div className="mt-2 space-y-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setDeliveryOption(opt.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-card border bg-surface p-4 text-left shadow-soft transition-all",
              deliveryOption === opt.id
                ? "border-brand-300 ring-1 ring-brand-200"
                : "border-paper-200/70 hover:border-paper-300"
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
                deliveryOption === opt.id
                  ? "bg-brand-600 text-paper-50"
                  : "bg-paper-100 text-gray-600"
              )}
            >
              {opt.id === "asap" ? <Clock size={16} /> : <Calendar size={16} />}
            </span>
            <div>
              <span className="text-sm font-semibold text-gray-900">
                {opt.label}
              </span>
              <p className="mt-0.5 text-xs text-gray-600">{opt.description}</p>
            </div>
            {deliveryOption === opt.id && (
              <span
                className={cn(
                  "ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                  deliveryOption === opt.id
                    ? "border-brand-600 bg-brand-600"
                    : "border-paper-300"
                )}
              >
                <span className="h-2 w-2 rounded-full bg-paper-50" />
              </span>
            )}
          </button>
        ))}

        {deliveryOption === "scheduled" && (
          <div className="rounded-card border border-paper-200/70 bg-surface p-4 shadow-soft">
            <label
              htmlFor="scheduled-date"
              className="mb-1.5 block text-sm font-semibold text-gray-800"
            >
              Select Date & Time
            </label>
            <input
              id="scheduled-date"
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="h-10 w-full rounded-button border border-paper-300 bg-paper-50 px-3 text-sm text-gray-900 transition-colors focus:border-brand-400 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
        )}
      </div>
    </section>
  );
}
