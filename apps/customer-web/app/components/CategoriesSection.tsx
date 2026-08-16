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
  { name: "Vegetables", count: "24+ items", icon: <Salad size={26} />, tint: "bg-brand-100 text-brand-700" },
  { name: "Fruits", count: "18+ items", icon: <Apple size={26} />, tint: "bg-khata-100 text-khata-600" },
  { name: "Dairy", count: "32+ items", icon: <Milk size={26} />, tint: "bg-sky-50 text-sky-700" },
  { name: "Bakery", count: "15+ items", icon: <Cookie size={26} />, tint: "bg-turmeric-100 text-turmeric-700" },
  { name: "Beverages", count: "28+ items", icon: <Coffee size={26} />, tint: "bg-teal-50 text-teal-700" },
  { name: "Snacks", count: "22+ items", icon: <Cherry size={26} />, tint: "bg-rose-50 text-rose-700" },
];

function CategoryCard({ category }: { category: Category }): ReactNode {
  return (
    <Card
      role="button"
      tabIndex={0}
      className="group cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lift hover:border-brand-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
    >
      <div className="flex flex-col items-center gap-2.5 p-4 sm:p-5">
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ring-inset ring-paper-900/5 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3 ${category.tint}`}
          aria-hidden="true"
        >
          {category.icon}
        </span>
        <span className="font-display text-sm font-bold text-gray-900">{category.name}</span>
        <span className="text-[11px] text-gray-500">{category.count}</span>
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
            <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors cursor-pointer">
              View All
              <ChevronRight size={14} aria-hidden="true" />
            </span>
          }
        />
        <div className="stagger grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-6">
          {categories.map((c) => (
            <CategoryCard key={c.name} category={c} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
