import { ArrowRight, Gift, Percent, ShoppingBag, Tag } from "lucide-react";
import { Container, Section, SectionHeading } from "./ui/Section";
import { Card, CardBody } from "./ui/Card";

type Offer = {
  id: string;
  discount: string;
  title: string;
  description: string;
  gradient: string;
  icon: React.ReactNode;
};

const offers: Offer[] = [
  {
    id: "1",
    discount: "20% OFF",
    title: "First Order",
    description: "On all grocery items",
    gradient: "from-brand-500 to-brand-600",
    icon: <Gift size={20} />,
  },
  {
    id: "2",
    discount: "Free Delivery",
    title: "Orders above ₹199",
    description: "No minimum order fee",
    gradient: "from-emerald-500 to-emerald-600",
    icon: <ShoppingBag size={20} />,
  },
  {
    id: "3",
    discount: "15% OFF",
    title: "Fresh Produce",
    description: "On fruits & vegetables",
    gradient: "from-green-500 to-green-600",
    icon: <Tag size={20} />,
  },
  {
    id: "4",
    discount: "10% OFF",
    title: "Weekly Deal",
    description: "Use code WEEKLY10",
    gradient: "from-violet-500 to-violet-600",
    icon: <Percent size={20} />,
  },
];

function OfferCard({ offer }: { offer: Offer }) {
  return (
    <Card className="group cursor-pointer overflow-hidden hover:-translate-y-0.5">
      <div className={`flex items-center gap-3 bg-gradient-to-br ${offer.gradient} p-4`}>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur">
          {offer.icon}
        </span>
        <span className="text-lg font-extrabold text-white">{offer.discount}</span>
      </div>
      <CardBody className="flex flex-col gap-1 p-4">
        <p className="text-sm font-semibold text-gray-900">{offer.title}</p>
        <p className="text-xs text-gray-500">{offer.description}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-600 transition-colors group-hover:text-brand-700">
          Grab offer
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </CardBody>
    </Card>
  );
}

export function BestOffers() {
  return (
    <Section>
      <Container>
        <SectionHeading title="Best Offers" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {offers.map((o) => (
            <OfferCard key={o.id} offer={o} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
