"use client";

import { useState, useMemo } from "react";
import { Container, Section } from "../components/ui/Section";
import { StoreFilters, type FilterId } from "../components/store/StoreFilters";
import { StoreSearch } from "../components/store/StoreSearch";
import { StoreGrid } from "../components/store/StoreGrid";
import { stores } from "../../lib/dummyStores";

export default function StoresPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");

  const filteredStores = useMemo(() => {
    let result = stores;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (filter) {
      case "fast-delivery":
        result = result.filter((s) => s.tags.includes("Fast Delivery"));
        break;
      case "top-rated":
        result = result.filter((s) => s.rating >= 4.5);
        break;
      case "free-delivery":
        result = result.filter((s) => s.deliveryFee === "Free");
        break;
      case "open-now":
        result = result.filter((s) => s.isOpen);
        break;
    }

    return result;
  }, [search, filter]);

  return (
    <div className="hero-wash min-h-screen">
      <Section className="pb-0">
        <Container>
          <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900">
            Nearby Grocery Stores
          </h1>
          <div className="mt-5 space-y-4">
            <StoreSearch value={search} onChange={setSearch} />
            <StoreFilters active={filter} onChange={setFilter} />
          </div>
        </Container>
      </Section>
      <Section>
        <Container>
          <p className="mb-4 text-sm text-gray-600">
            {filteredStores.length}{" "}
            {filteredStores.length === 1 ? "store" : "stores"} found
          </p>
          <StoreGrid stores={filteredStores} />
        </Container>
      </Section>
    </div>
  );
}
