"use client";

import { MapPin } from "lucide-react";

export function OrderMapPlaceholder() {
  return (
    <section>
      <h2 className="font-display text-base font-bold tracking-tight text-gray-900">Live Tracking</h2>
      <div className="mt-2 flex h-48 items-center justify-center rounded-card border border-dashed border-paper-300 bg-paper-100/60 sm:h-56">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <MapPin size={22} />
          </span>
          <p className="text-sm font-medium text-gray-600">
            Live tracking will be available<br />
            after backend integration.
          </p>
        </div>
      </div>
    </section>
  );
}
