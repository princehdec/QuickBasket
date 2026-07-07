"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, ShoppingCart, X } from "lucide-react";
import type { Store } from "../../../lib/mock/stores";

export function StoreInfoBar({
  store,
  search,
  onSearchChange,
}: {
  store: Store;
  search: string;
  onSearchChange: (value: string) => void;
}) {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>

        {showSearch ? (
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              autoFocus
              className="h-9 w-full rounded-button border border-gray-200 bg-gray-50 pl-9 pr-8 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            <button
              type="button"
              onClick={() => {
                onSearchChange("");
                setShowSearch(false);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">{store.name}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowSearch(true)}
              aria-label="Search products"
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
            >
              <Search size={20} />
            </button>
          </>
        )}

        <button
          type="button"
          aria-label="Shopping cart"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
        >
          <ShoppingCart size={20} />
        </button>
      </div>
    </div>
  );
}
