import type { ReactNode } from "react";
import { Apple, Cherry, Coffee, Cookie, Milk, Salad, ChevronRight } from "lucide-react";
import { Container, Section, SectionHeading } from "./ui/Section";
import { Card } from "./ui/Card";

type Category = {
  name: string;
  count: string;
  icon: ReactNode;
  tint: string;
};

const categories: Category[] = [
  { name: "Vegetables", count: "24+ items", icon: <Salad size={26} />, tint: "bg-green-50 text-green-700" },
  { name: "Fruits", count: "18+ items", icon: <Apple size={26} />, tint: "bg-red-50 text-red-600" },
  { name: "Dairy", count: "32+ items", icon: <Milk size={26} />, tint: "bg-blue-50 text-blue-600" },
  { name: "Bakery", count: "15+ items", icon: <Cookie size={26} />, tint: "bg-amber-50 text-amber-600" },
  { name: "Beverages", count: "28+ items", icon: <Coffee size={26} />, tint: "bg-cyan-50 text-cyan-600" },
  { name: "Snacks", count: "22+ items", icon: <Cherry size={26} />, tint: "bg-pink-50 text-pink-600" },
];

function CategoryCard({ category }: { category: Category }): ReactNode {
  return (
    <Card
      role="button"
      tabIndex={0}
      className="group cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-brand-200/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
    >
      <div className="flex flex-col items-center gap-2.5 p-4 sm:p-5">
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-110 ${category.tint}`}
          aria-hidden="true"
        >
          {category.icon}
        </span>
        <span className="text-sm font-semibold text-gray-900">{category.name}</span>
        <span className="text-[11px] text-gray-400">{category.count}</span>
      </div>
    </Card>
  );
}

export function CategoriesSection() {
  return (
    <Section>
      <Container>
        <SectionHeading
          title="Shop by Category"
          action={
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors cursor-pointer">
              View All
              <ChevronRight size={14} aria-hidden="true" />
            </span>
          }
        />
        <div className="grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-6">
          {categories.map((c) => (
            <CategoryCard key={c.name} category={c} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
