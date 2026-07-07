"use client";

import { useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Construction, ShoppingBag } from "lucide-react";
import { stores } from "../../../lib/mock/stores";
import { products } from "../../../lib/mock/products";
import { categories } from "../../../lib/mock/categories";
import { StoreHeader } from "../../components/store/StoreHeader";
import { StoreInfoBar } from "../../components/store/StoreInfoBar";
import { CategoryTabs } from "../../components/store/CategoryTabs";
import { ProductGrid } from "../../components/store/ProductGrid";
import { Button } from "../../components/ui/Button";

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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8F9FA] px-4 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <Construction size={36} />
        </span>
        <h1 className="text-2xl font-bold text-gray-900">Store not found</h1>
        <p className="text-sm text-gray-500">
          The store you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        <Link href="/stores">
          <Button variant="outline" size="md">
            <ArrowLeft size={16} />
            Browse Stores
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
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
