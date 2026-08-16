"use client";

import { useMemo } from "react";
import type { Product } from "../../../lib/mock/products";
import type { Store } from "../../../lib/dummyStores";
import type { Category } from "../../../lib/mock/categories";
import { categories } from "../../../lib/mock/categories";
import { productKeywords } from "../../../lib/mock/searchKeywords";
import { ProductResultCard } from "./ProductResultCard";
import { StoreResultCard } from "./StoreResultCard";
import { NoResults } from "./NoResults";
import type { TabId } from "./SearchTabs";

function searchProducts(query: string, products: Product[]): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return products.filter((p) => {
    const categoryName = categories.find((c) => c.id === p.categoryId)?.name ?? "";
    const keywordMatch = (productKeywords[p.id] ?? []).some((k) =>
      k.toLowerCase().includes(q)
    );
    return (
      p.name.toLowerCase().includes(q) ||
      categoryName.toLowerCase().includes(q) ||
      keywordMatch
    );
  });
}

function searchStores(query: string, stores: Store[]): Store[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return stores.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
  );
}

export function SearchResults({
  query,
  activeTab,
  products,
  stores,
}: {
  query: string;
  activeTab: TabId;
  products: Product[];
  stores: Store[];
}) {
  const matchedProducts = useMemo(
    () => searchProducts(query, products),
    [query, products]
  );
  const matchedStores = useMemo(
    () => searchStores(query, stores),
    [query, stores]
  );

  if (activeTab === "products" && matchedProducts.length === 0) {
    return <NoResults query={query} />;
  }

  if (activeTab === "stores" && matchedStores.length === 0) {
    return <NoResults query={query} />;
  }

  if (activeTab === "all" && matchedProducts.length === 0 && matchedStores.length === 0) {
    return <NoResults query={query} />;
  }

  return (
    <div className="space-y-6">
      {activeTab !== "stores" && matchedProducts.length > 0 && (
        <section>
          {activeTab === "all" && (
            <h3 className="mb-3 font-display text-sm font-bold text-gray-900">
              Products ({matchedProducts.length})
            </h3>
          )}
          <div className="space-y-2">
            {matchedProducts.map((product) => (
              <ProductResultCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {activeTab !== "products" && matchedStores.length > 0 && (
        <section>
          {activeTab === "all" && (
            <h3 className="mb-3 font-display text-sm font-bold text-gray-900">
              Stores ({matchedStores.length})
            </h3>
          )}
          <div className="space-y-2">
            {matchedStores.map((store) => (
              <StoreResultCard key={store.id} store={store} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
