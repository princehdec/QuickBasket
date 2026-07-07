import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Section, SectionHeading } from "./ui/Section";
import { StoreCard } from "./store/StoreCard";
import { stores } from "../../lib/dummyStores";

export function NearbyStores() {
  const featured = stores.slice(0, 4);

  return (
    <Section>
      <Container>
        <SectionHeading
          title="Nearby Grocery Stores"
          action={
            <Link
              href="/stores"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              View All
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
