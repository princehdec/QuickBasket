"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Construction, Loader2 } from "lucide-react";
import { getBusiness, listProducts, toCustomerStore, type CustomerProduct } from "../../../lib/api";
import type { Store } from "../../../lib/dummyStores";
import { StoreHeader } from "../../components/store/StoreHeader";
import { StoreInfoBar } from "../../components/store/StoreInfoBar";
import { CategoryTabs } from "../../components/store/CategoryTabs";
import { ProductGrid } from "../../components/store/ProductGrid";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";

export default function StorePage() {
  const { storeId } = useParams<{ storeId: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<CustomerProduct[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all([
      getBusiness(storeId),
      listProducts({ businessId: storeId, isAvailable: true, limit: 50 }),
    ])
      .then(([business, productResult]) => {
        if (cancelled) return;
        setStore(toCustomerStore(business));
        setProducts(productResult.items);
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "Unable to load this store");
          setStore(null);
          setProducts([]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [storeId]);

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    const q = search.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        product.brand?.toLowerCase().includes(q) ||
        product.categoryName?.toLowerCase().includes(q)
    );
  }, [products, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, CustomerProduct[]>();
    for (const product of filteredProducts) {
      const key = product.categoryName ?? "all-products";
      const list = map.get(key) ?? [];
      list.push(product);
      map.set(key, list);
    }
    return map;
  }, [filteredProducts]);

  const activeCategories = useMemo(
    () => Array.from(grouped.keys()).map((id) => ({
      id,
      name: id === "all-products" ? "All products" : id,
      slug: id,
    })),
    [grouped]
  );

  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);
    const el = document.getElementById(`category-${id}`);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="hero-wash flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-brand-700" aria-label="Loading store" />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="hero-wash flex min-h-screen flex-col items-center justify-center px-4">
        <EmptyState
          icon={Construction}
          title="Store not found"
          description={error ?? "The store you're looking for doesn't exist or may have been removed."}
          action={
            <Link href="/stores">
              <Button variant="outline" size="md">
                <ArrowLeft size={16} />
                Browse Stores
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreInfoBar store={store} search={search} onSearchChange={setSearch} />
      <StoreHeader store={store} />
      <CategoryTabs
        categories={activeCategories}
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />
      <ProductGrid
        groups={grouped}
        categories={activeCategories}
        searchQuery={search}
      />
    </div>
  );
}
