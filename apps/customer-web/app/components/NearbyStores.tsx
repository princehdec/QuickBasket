import { Clock, MapPin, Star } from "lucide-react";
import { Container, Section, SectionHeading } from "./ui/Section";
import { Card, CardImage, CardBody } from "./ui/Card";
import { Badge } from "./ui/Badge";

type Store = {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  distance: string;
  minOrder: string;
  tag?: string;
};

const stores: Store[] = [
  { id: "fresh-mart", name: "Fresh Mart", rating: 4.8, deliveryTime: "20-30 min", distance: "2.1 km", minOrder: "₹199", tag: "Popular" },
  { id: "green-grocer", name: "Green Grocer", rating: 4.6, deliveryTime: "25-35 min", distance: "3.5 km", minOrder: "₹149" },
  { id: "daily-basket", name: "Daily Basket", rating: 4.7, deliveryTime: "15-25 min", distance: "1.8 km", minOrder: "₹99", tag: "Fastest" },
  { id: "organic-hub", name: "Organic Hub", rating: 4.9, deliveryTime: "30-40 min", distance: "4.2 km", minOrder: "₹299" },
];

function StoreCard({ store }: { store: Store }) {
  return (
    <Card className="h-full overflow-hidden group hover:-translate-y-0.5">
      <CardImage>
        {store.tag ? (
          <div className="pointer-events-none absolute left-2.5 top-2.5 z-10">
            <Badge variant="accent">{store.tag}</Badge>
          </div>
        ) : null}
      </CardImage>

      <CardBody className="flex flex-col gap-3">
        <h3 className="truncate text-base font-semibold text-gray-900">{store.name}</h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1">
            <Star size={14} className="fill-brand-500 text-brand-500" aria-hidden="true" />
            <span className="font-semibold text-gray-900">{store.rating.toFixed(1)}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} className="text-gray-400" aria-hidden="true" />
            {store.distance}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
          <div>
            <p className="text-gray-400">Delivery</p>
            <p className="mt-0.5 flex items-center gap-1 font-semibold text-gray-900">
              <Clock size={12} className="text-gray-400" aria-hidden="true" />
              {store.deliveryTime}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-400">Min. order</p>
            <p className="mt-0.5 font-semibold text-gray-900">{store.minOrder}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export function NearbyStores() {
  return (
    <Section>
      <Container>
        <SectionHeading title="Nearby Grocery Stores" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
