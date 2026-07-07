"use client";

import { PackageSearch } from "lucide-react";
import type { Category } from "../../../lib/mock/categories";
import type { Product } from "../../../lib/mock/products";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  groups,
  categories,
  searchQuery,
}: {
  groups: Map<string, Product[]>;
  categories: Category[];
  searchQuery: string;
}) {
  if (groups.size === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <PackageSearch size={28} />
          </span>
          <p className="text-lg font-semibold text-gray-900">No products found</p>
          <p className="max-w-xs text-sm text-gray-500">
            {searchQuery
              ? `No products match "${searchQuery}". Try a different search term.`
              : "This store has no products yet."}
          </p>
        </div>
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
            <h2 className="mb-4 pt-6 text-lg font-bold text-gray-900">{cat.name}</h2>
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
