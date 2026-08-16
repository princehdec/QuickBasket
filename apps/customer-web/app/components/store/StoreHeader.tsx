"use client";

import { useState } from "react";
import { Clock, Heart, MapPin, Share2, ShoppingBag, Star } from "lucide-react";
import type { Store } from "../../../lib/mock/stores";

export function StoreHeader({ store }: { store: Store }) {
  const [favorited, setFavorited] = useState(false);

  return (
    <div>
      <div className={`relative h-44 bg-gradient-to-br ${store.bannerGradient} sm:h-56`}>
        <div className="absolute right-3 top-3 flex gap-2">
          <button
            type="button"
            onClick={() => setFavorited(!favorited)}
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-colors ${
              favorited
                ? "bg-khata-500 text-white"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <Heart size={18} fill={favorited ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            aria-label="Share store"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/30"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-10 mb-6 flex items-end gap-4">
          <div
            className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${store.logoGradient} shadow-lift ring-4 ring-surface`}
            aria-hidden="true"
          >
            <ShoppingBag size={32} className="text-white" />
          </div>
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold tracking-tight text-gray-900">{store.name}</h1>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  store.isOpen
                    ? "bg-brand-100 text-brand-800"
                    : "bg-paper-100 text-gray-600"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    store.isOpen ? "bg-brand-500" : "bg-paper-400"
                  }`}
                />
                {store.isOpen ? "Open" : "Closed"}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm tabular-nums text-gray-600">
              <span className="inline-flex items-center gap-1">
                <Star size={14} className="fill-turmeric-400 text-turmeric-400" />
                {store.rating}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={14} />
                {store.deliveryTime}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={14} />
                {store.distance}
              </span>
            </div>
            <div className="mt-1 text-xs tabular-nums text-gray-500">
              Min {store.minOrder} &middot;{" "}
              {store.deliveryFee === "Free" ? "Free delivery" : `${store.deliveryFee} delivery`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
