"use client";

import { useEffect, useMemo, useState } from "react";
import { Container, Section } from "../components/ui/Section";
import { StoreFilters, type FilterId } from "../components/store/StoreFilters";
import { StoreSearch } from "../components/store/StoreSearch";
import { StoreGrid } from "../components/store/StoreGrid";
import type { Store } from "../../lib/dummyStores";
import { listBusinesses, toCustomerStore } from "../../lib/api";
import { useLocation } from "../context/LocationContext";
import { useLang } from "../i18n/LanguageContext";

export default function StoresPage() {
  const { t } = useLang();
  const { selectedLocation } = useLocation();
  const city = selectedLocation?.city ?? "";
  const [stores, setStores] = useState<Store[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    listBusinesses({ city: city || undefined, limit: 50 })
      .then((result) => {
        if (!cancelled) setStores(result.items.map(toCustomerStore));
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "Unable to load stores");
          setStores([]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [city]);

  const filteredStores = useMemo(() => {
    let result = stores;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (store) =>
          store.name.toLowerCase().includes(q) ||
          store.description.toLowerCase().includes(q) ||
          store.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    switch (filter) {
      case "fast-delivery":
        result = result.filter((store) => store.tags.includes("Fast Delivery"));
        break;
      case "top-rated":
        result = result.filter((store) => store.rating >= 4.5);
        break;
      case "free-delivery":
        result = result.filter((store) => store.deliveryFee === "Free");
        break;
      case "open-now":
        result = result.filter((store) => store.isOpen);
        break;
    }

    return result;
  }, [filter, search, stores]);

  return (
    <div className="hero-wash min-h-screen">
      <Section className="pb-0">
        <Container>
          <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900">
            {t("Nearby Grocery Stores")}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {city ? `${t("Delivering in")} ${city}` : t("Choose a location to see nearby stores")}
          </p>
          <div className="mt-5 space-y-4">
            <StoreSearch value={search} onChange={setSearch} />
            <StoreFilters active={filter} onChange={setFilter} />
          </div>
        </Container>
      </Section>
      <Section>
        <Container>
          {error && (
            <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          {!isLoading && !error && (
            <p className="mb-4 text-sm text-gray-600">
              {filteredStores.length}{" "}
              {filteredStores.length === 1 ? t("store found") : t("stores found")}
            </p>
          )}
          <StoreGrid stores={filteredStores} isLoading={isLoading} />
        </Container>
      </Section>
    </div>
  );
}
