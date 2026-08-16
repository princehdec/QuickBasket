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
    gradient: "from-turmeric-400 to-turmeric-600",
    icon: <Gift size={20} />,
  },
  {
    id: "2",
    discount: "Free Delivery",
    title: "Orders above ₹199",
    description: "No minimum order fee",
    gradient: "from-brand-500 to-brand-700",
    icon: <ShoppingBag size={20} />,
  },
  {
    id: "3",
    discount: "15% OFF",
    title: "Fresh Produce",
    description: "On fruits & vegetables",
    gradient: "from-brand-400 to-turmeric-500",
    icon: <Tag size={20} />,
  },
  {
    id: "4",
    discount: "10% OFF",
    title: "Weekly Deal",
    description: "Use code WEEKLY10",
    gradient: "from-brand-700 to-brand-900",
    icon: <Percent size={20} />,
  },
];

function OfferCard({ offer }: { offer: Offer }) {
  return (
    <Card className="group cursor-pointer overflow-hidden hover:-translate-y-0.5">
      <div className={`flex items-center gap-3 bg-gradient-to-br ${offer.gradient} p-4`}>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-paper-50 backdrop-blur-sm ring-1 ring-inset ring-white/25">
          {offer.icon}
        </span>
        <span className="font-display text-lg font-extrabold tracking-tight text-paper-50">{offer.discount}</span>
      </div>
      <CardBody className="flex flex-col gap-1 p-4">
        <p className="font-display text-sm font-bold text-gray-900">{offer.title}</p>
        <p className="text-xs text-gray-600">{offer.description}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-600 transition-colors group-hover:text-brand-700">
          Grab offer
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
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
        <div className="stagger grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {offers.map((o) => (
            <OfferCard key={o.id} offer={o} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
