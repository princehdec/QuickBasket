"use client";

import Link from "next/link";
import { Clock, MapPin, ShoppingBag, Star } from "lucide-react";
import type { Store } from "../../../lib/dummyStores";

export function StoreResultCard({ store }: { store: Store }) {
  return (
    <Link
      href={`/store/${store.id}`}
      className="flex items-center gap-4 rounded-card border border-paper-200/70 bg-surface p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${store.logoGradient}`}
        aria-hidden="true"
      >
        <ShoppingBag size={20} className="text-white" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="truncate text-sm font-semibold text-gray-900">
            {store.name}
          </h4>
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold tabular-nums text-gray-900">
            <Star size={12} className="fill-turmeric-400 text-turmeric-400" />
            {store.rating}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs text-gray-600">
          {store.description}
        </p>
        <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <Clock size={11} />
            {store.deliveryTime}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={11} />
            {store.distance}
          </span>
          <span
            className={`ml-auto text-xs font-bold ${store.isOpen ? "text-brand-700" : "text-gray-500"}`}
          >
            {store.isOpen ? "Open" : "Closed"}
          </span>
        </div>
      </div>
    </Link>
  );
}
