"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { Container, Section, SectionHeading } from "./ui/Section";
import { StoreCard } from "./store/StoreCard";
import { listBusinesses, toCustomerStore, type CustomerStore } from "../../lib/api";
import { useLocation } from "../context/LocationContext";
import { useLang } from "../i18n/LanguageContext";

export function NearbyStores() {
  const { t } = useLang();
  const { selectedLocation } = useLocation();
  const [stores, setStores] = useState<CustomerStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    listBusinesses({ city: selectedLocation?.city, limit: 4 })
      .then((result) => {
        if (!cancelled) setStores(result.items.map(toCustomerStore));
      })
      .catch(() => {
        if (!cancelled) setStores([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedLocation?.city]);

  return (
    <Section>
      <Container>
        <SectionHeading
          title={t("Nearby Stores")}
          action={
            <Link
              href="/stores"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              {t("View All")}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          }
        />
        {isLoading ? (
          <div className="flex min-h-40 items-center justify-center text-brand-700" aria-label={t("Loading stores")}>
            <Loader2 className="animate-spin" />
          </div>
        ) : stores.length === 0 ? (
          <p className="rounded-card border border-dashed border-paper-300 bg-surface p-6 text-center text-sm text-gray-600">
            {t("No stores are available in this city yet")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
