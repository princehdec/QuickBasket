import { Apple, Cherry, Coffee, Cookie, Milk, Plus, Salad } from "lucide-react";
import { Container, Section, SectionHeading } from "./ui/Section";
import { Card, CardBody } from "./ui/Card";

type Product = {
  id: string;
  name: string;
  price: string;
  gradient: string;
  icon: React.ReactNode;
};

const products: Product[] = [
  { id: "1", name: "Fresh Apples", price: "₹120/kg", gradient: "from-red-50 to-red-100", icon: <Apple size={22} /> },
  { id: "2", name: "Organic Milk", price: "₹80/L", gradient: "from-blue-50 to-blue-100", icon: <Milk size={22} /> },
  { id: "3", name: "Whole Wheat Bread", price: "₹45", gradient: "from-amber-50 to-amber-100", icon: <Cookie size={22} /> },
  { id: "4", name: "Coffee Beans", price: "₹350/kg", gradient: "from-cyan-50 to-cyan-100", icon: <Coffee size={22} /> },
  { id: "5", name: "Fresh Salad", price: "₹60/pack", gradient: "from-green-50 to-green-100", icon: <Salad size={22} /> },
  { id: "6", name: "Mixed Fruits", price: "₹180/kg", gradient: "from-pink-50 to-pink-100", icon: <Cherry size={22} /> },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group shrink-0 w-[160px] sm:w-[180px] cursor-pointer hover:-translate-y-0.5">
      <div className={`flex h-28 items-center justify-center bg-gradient-to-br ${product.gradient}`}>
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/60 text-gray-700 backdrop-blur transition-transform group-hover:scale-110">
          {product.icon}
        </span>
      </div>
      <CardBody className="flex flex-col gap-1.5 p-3">
        <p className="truncate text-sm font-semibold text-gray-900">{product.name}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-brand-600">{product.price}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors hover:bg-brand-500 hover:text-white">
            <Plus size={14} />
          </span>
        </div>
      </CardBody>
    </Card>
  );
}

export function TrendingProducts() {
  return (
    <Section>
      <Container>
        <SectionHeading title="Trending Products" />
        <div className="flex gap-3 overflow-x-auto pb-2 sm:gap-4 scrollbar-none">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
