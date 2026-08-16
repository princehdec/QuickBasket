"use client";

import { useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";
import { stores } from "../../../lib/mock/stores";
import { products } from "../../../lib/mock/products";
import { categories } from "../../../lib/mock/categories";
import { StoreHeader } from "../../components/store/StoreHeader";
import { StoreInfoBar } from "../../components/store/StoreInfoBar";
import { CategoryTabs } from "../../components/store/CategoryTabs";
import { ProductGrid } from "../../components/store/ProductGrid";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";

export default function StorePage() {
  const { storeId } = useParams<{ storeId: string }>();
  const store = stores.find((s) => s.id === storeId);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categoryRefs = useRef<Map<string, HTMLElement>>(new Map());

  const storeProducts = useMemo(
    () => products.filter((p) => p.storeId === storeId),
    [storeId]
  );

  const filteredProducts = useMemo(() => {
    if (!search) return storeProducts;
    const q = search.toLowerCase();
    return storeProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryId.toLowerCase().includes(q)
    );
  }, [storeProducts, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filteredProducts>();
    for (const p of filteredProducts) {
      const list = map.get(p.categoryId) || [];
      list.push(p);
      map.set(p.categoryId, list);
    }
    return map;
  }, [filteredProducts]);

  const activeCategories = useMemo(
    () => categories.filter((c) => grouped.has(c.id)),
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

  if (!store) {
    return (
      <div className="hero-wash flex min-h-screen flex-col items-center justify-center px-4">
        <EmptyState
          icon={Construction}
          title="Store not found"
          description="The store you're looking for doesn't exist or may have been removed."
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
