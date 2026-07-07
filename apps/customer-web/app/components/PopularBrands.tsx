import { Container, Section, SectionHeading } from "./ui/Section";
import { Card } from "./ui/Card";

type Brand = {
  id: string;
  name: string;
  gradient: string;
};

const brands: Brand[] = [
  { id: "1", name: "FreshFarm", gradient: "from-green-100 to-green-200" },
  { id: "2", name: "DailyDairy", gradient: "from-blue-100 to-blue-200" },
  { id: "3", name: "BakeHouse", gradient: "from-amber-100 to-amber-200" },
  { id: "4", name: "OrganicValley", gradient: "from-emerald-100 to-emerald-200" },
  { id: "5", name: "PureBev", gradient: "from-cyan-100 to-cyan-200" },
  { id: "6", name: "SnackTime", gradient: "from-pink-100 to-pink-200" },
];

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Card className="group cursor-pointer hover:-translate-y-0.5">
      <div className={`flex h-20 items-center justify-center rounded-card bg-gradient-to-br ${brand.gradient} transition-all duration-200 group-hover:shadow-inner`}>
        <span className="text-sm font-bold tracking-tight text-gray-700">{brand.name}</span>
      </div>
    </Card>
  );
}

export function PopularBrands() {
  return (
    <Section>
      <Container>
        <SectionHeading title="Popular Brands" />
        <div className="grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-6">
          {brands.map((b) => (
            <BrandCard key={b.id} brand={b} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
