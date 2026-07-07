"use client";

import Link from "next/link";
import { Clock, MapPin, ShoppingBag, Star } from "lucide-react";
import type { Store } from "../../../lib/dummyStores";

export function StoreResultCard({ store }: { store: Store }) {
  return (
    <Link
      href={`/store/${store.id}`}
      className="flex items-center gap-4 rounded-card border border-gray-100 bg-white p-3 shadow-sm transition-all hover:shadow-md"
    >
      <div
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${store.logoGradient}`}
        aria-hidden="true"
      >
        <ShoppingBag size={20} className="text-white" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="truncate text-sm font-semibold text-gray-900">
            {store.name}
          </h4>
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-gray-900">
            <Star size={12} className="fill-brand-500 text-brand-500" />
            {store.rating}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
          {store.description}
        </p>
        <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-400">
          <span className="inline-flex items-center gap-1">
            <Clock size={11} />
            {store.deliveryTime}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={11} />
            {store.distance}
          </span>
          <span
            className={`ml-auto text-xs font-medium ${store.isOpen ? "text-green-600" : "text-gray-400"}`}
          >
            {store.isOpen ? "Open" : "Closed"}
          </span>
        </div>
      </div>
    </Link>
  );
}
