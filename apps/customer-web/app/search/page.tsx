"use client";

import { Suspense, useState, useCallback, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { products } from "../../lib/mock/products";
import { stores } from "../../lib/dummyStores";
import { useSearch } from "../contexts/SearchContext";
import { SearchBar } from "../components/search/SearchBar";
import { SearchTabs, type TabId } from "../components/search/SearchTabs";
import { SearchResults } from "../components/search/SearchResults";
import { RecentSearches } from "../components/search/RecentSearches";
import { PopularSearches } from "../components/search/PopularSearches";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addRecentSearch } = useSearch();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      if (value.trim()) {
        addRecentSearch(value.trim());
      }
      const params = new URLSearchParams();
      if (value.trim()) params.set("q", value.trim());
      router.replace(
        `/search${params.toString() ? `?${params.toString()}` : ""}`,
        { scroll: false }
      );
    },
    [addRecentSearch, router]
  );

  const handleTabChange = useCallback((id: TabId) => {
    setActiveTab(id);
  }, []);

  const handleSelectTerm = useCallback(
    (term: string) => {
      setSearchTerm(term);
      addRecentSearch(term);
      const params = new URLSearchParams();
      params.set("q", term);
      router.replace(`/search?${params.toString()}`, { scroll: false });
    },
    [addRecentSearch, router]
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const hasQuery = searchTerm.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <SearchBar
        value={searchTerm}
        onChange={handleSearchChange}
        onBack={handleBack}
      />
      {hasQuery && (
        <SearchTabs active={activeTab} onChange={handleTabChange} />
      )}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {hasQuery ? (
          <SearchResults
            query={searchTerm}
            activeTab={activeTab}
            products={products}
            stores={stores}
          />
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
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F9FA]" />}>
      <SearchContent />
    </Suspense>
  );
}
