import { Container, Section, SectionHeading } from "./ui/Section";
import { Card } from "./ui/Card";

type Brand = {
  id: string;
  name: string;
  gradient: string;
};

const brands: Brand[] = [
  { id: "1", name: "FreshFarm", gradient: "from-brand-100 to-paper-100" },
  { id: "2", name: "DailyDairy", gradient: "from-sky-50 to-paper-100" },
  { id: "3", name: "BakeHouse", gradient: "from-turmeric-100 to-paper-100" },
  { id: "4", name: "OrganicValley", gradient: "from-teal-50 to-paper-100" },
  { id: "5", name: "PureBev", gradient: "from-rose-50 to-paper-100" },
  { id: "6", name: "SnackTime", gradient: "from-khata-100 to-paper-100" },
];

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Card className="group cursor-pointer hover:-translate-y-0.5">
      <div className={`flex h-20 items-center justify-center rounded-t-card bg-gradient-to-br ${brand.gradient} transition-all duration-200`}>
        <span className="font-display text-sm font-bold tracking-tight text-gray-800">{brand.name}</span>
      </div>
    </Card>
  );
}

export function PopularBrands() {
  return (
    <Section>
      <Container>
        <SectionHeading title="Popular Brands" />
        <div className="stagger grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-6">
          {brands.map((b) => (
            <BrandCard key={b.id} brand={b} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
