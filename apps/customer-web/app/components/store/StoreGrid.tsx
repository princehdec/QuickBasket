import { ShoppingBag } from "lucide-react";
import type { Store } from "../../../lib/dummyStores";
import { StoreCard } from "./StoreCard";
import { StoreSkeleton } from "./StoreSkeleton";

export function StoreGrid({
  stores,
  isLoading,
}: {
  stores: Store[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <StoreSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <ShoppingBag size={28} />
        </span>
        <p className="text-lg font-semibold text-gray-900">No stores found</p>
        <p className="max-w-xs text-sm text-gray-500">
          Try adjusting your search or filters to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stores.map((store) => (
        <StoreCard key={store.id} store={store} />
      ))}
    </div>
  );
}
