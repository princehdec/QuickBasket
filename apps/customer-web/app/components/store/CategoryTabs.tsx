"use client";

import { cn } from "../../../lib/utils";
import type { Category } from "../../../lib/mock/categories";

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryClick,
}: {
  categories: Category[];
  activeCategory: string | null;
  onCategoryClick: (id: string) => void;
}) {
  if (categories.length === 0) return null;

  return (
    <div className="sticky top-14 z-30 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryClick(cat.id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                activeCategory === cat.id
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
