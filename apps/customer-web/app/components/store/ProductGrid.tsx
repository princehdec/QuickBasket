"use client";

import { PackageSearch } from "lucide-react";
import type { CustomerProduct } from "../../../lib/api";
type StoreCategory = { id: string; name: string };
import { ProductCard } from "./ProductCard";
import { EmptyState } from "../ui/EmptyState";
import { useLang } from "../../i18n/LanguageContext";

export function ProductGrid({
  groups,
  categories,
  searchQuery,
}: {
  groups: Map<string, CustomerProduct[]>;
  categories: StoreCategory[];
  searchQuery: string;
}) {
  const { t } = useLang();
  if (groups.size === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <EmptyState
          icon={PackageSearch}
          title={t("No products found")}
          description={
            searchQuery
              ? `${t("No products match")} "${searchQuery}"${t(". Try a different search term.")}`
              : t("This store has no products yet.")
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      {categories.map((cat) => {
        const catProducts = groups.get(cat.id);
        if (!catProducts || catProducts.length === 0) return null;

        return (
          <section key={cat.id} id={`category-${cat.id}`} className="scroll-mt-28">
            <h2 className="mb-4 pt-6 font-display text-lg font-bold tracking-tight text-gray-900">{cat.name}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {catProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
