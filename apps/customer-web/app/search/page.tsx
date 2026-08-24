"use client";

import { Suspense, useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { listBusinesses, listProducts, toCustomerStore, type CustomerProduct, type CustomerStore } from "../../lib/api";
import { useSearch } from "../contexts/SearchContext";
import { useLocation } from "../context/LocationContext";
import { SearchBar } from "../components/search/SearchBar";
import { SearchTabs, type TabId } from "../components/search/SearchTabs";
import { SearchResults } from "../components/search/SearchResults";
import { RecentSearches } from "../components/search/RecentSearches";
import { PopularSearches } from "../components/search/PopularSearches";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addRecentSearch } = useSearch();
  const { selectedLocation } = useLocation();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [products, setProducts] = useState<CustomerProduct[]>([]);
  const [stores, setStores] = useState<CustomerStore[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const hasQuery = searchTerm.trim().length > 0;

  useEffect(() => {
    let cancelled = false;
    if (!hasQuery) {
      setProducts([]);
      setStores([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const load = async () => {
      if (!selectedLocation?.city) {
        const [productResult, businessResult] = await Promise.all([
          listProducts({ isAvailable: true, limit: 100 }),
          listBusinesses({ limit: 100 }),
        ]);
        return { products: productResult.items, stores: businessResult.items.map(toCustomerStore) };
      }

      const businessResult = await listBusinesses({ city: selectedLocation.city, limit: 100 });
      const productResults = await Promise.all(
        businessResult.items.map((business) => listProducts({ businessId: business.id, isAvailable: true, limit: 100 }))
      );
      return {
        products: productResults.flatMap((result) => result.items),
        stores: businessResult.items.map(toCustomerStore),
      };
    };

    load()
      .then((result) => {
        if (!cancelled) {
          setProducts(result.products);
          setStores(result.stores);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([]);
          setStores([]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [hasQuery, selectedLocation?.city]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      if (value.trim()) addRecentSearch(value.trim());
      const params = new URLSearchParams();
      if (value.trim()) params.set("q", value.trim());
      router.replace(`/search${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
    },
    [addRecentSearch, router]
  );

  const handleSelectTerm = useCallback(
    (term: string) => {
      setSearchTerm(term);
      addRecentSearch(term);
      router.replace(`/search?q=${encodeURIComponent(term)}`, { scroll: false });
    },
    [addRecentSearch, router]
  );

  const handleBack = useCallback(() => router.back(), [router]);

  return (
    <div className="min-h-screen bg-background">
      <SearchBar value={searchTerm} onChange={handleSearchChange} onBack={handleBack} />
      {hasQuery && <SearchTabs active={activeTab} onChange={setActiveTab} />}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {hasQuery ? (
          isLoading ? (
            <div className="flex min-h-48 items-center justify-center text-brand-700" aria-label="Loading search results">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <SearchResults query={searchTerm} activeTab={activeTab} products={products} stores={stores} />
          )
        ) : (
          <div className="space-y-8">
            <RecentSearches onSelect={handleSelectTerm} />
            <PopularSearches onSelect={handleSelectTerm} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<div className="min-h-screen bg-background" />}><SearchContent /></Suspense>;
}
