import { ShoppingBag } from "lucide-react";
import type { Store } from "../../../lib/dummyStores";
import { StoreCard } from "./StoreCard";
import { StoreSkeleton } from "./StoreSkeleton";
import { EmptyState } from "../ui/EmptyState";

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
      <EmptyState
        icon={ShoppingBag}
        title="No stores found"
        description="Try adjusting your search or filters to find what you're looking for."
      />
    );
  }

  return (
    <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stores.map((store) => (
        <StoreCard key={store.id} store={store} />
      ))}
    </div>
  );
}
