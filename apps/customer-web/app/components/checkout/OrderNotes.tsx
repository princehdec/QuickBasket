"use client";

import { MessageSquare } from "lucide-react";
import { useCheckout } from "../../contexts/CheckoutContext";

export function OrderNotes() {
  const { orderNotes, setOrderNotes } = useCheckout();

  return (
    <section>
      <h2 className="font-display text-base font-bold tracking-tight text-gray-900">Order Notes</h2>
      <div className="mt-2">
        <div className="relative">
          <MessageSquare
            size={16}
            className="pointer-events-none absolute left-3 top-3.5 text-paper-400"
          />
          <textarea
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="Instructions for delivery partner..."
            rows={3}
            className="w-full resize-none rounded-button border border-paper-300 bg-paper-50 py-3 pl-9 pr-3 text-sm text-gray-900 placeholder:text-paper-400 transition-colors focus:border-brand-400 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>
    </section>
  );
}
