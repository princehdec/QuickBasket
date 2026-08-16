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
    <div className="sticky top-14 z-30 border-b border-paper-200/80 bg-surface/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryClick(cat.id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all duration-150 active:scale-95",
                activeCategory === cat.id
                  ? "border-brand-600 bg-brand-600 text-paper-50 shadow-[0_2px_8px_-2px_rgb(18_50_30/0.4)]"
                  : "border-paper-300 bg-surface text-gray-700 hover:border-paper-400 hover:text-gray-900"
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
