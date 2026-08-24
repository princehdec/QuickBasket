"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Plus } from "lucide-react";
import { Container, Section, SectionHeading } from "./ui/Section";
import { Card, CardBody } from "./ui/Card";
import { listBusinesses, listProducts, type CustomerProduct } from "../../lib/api";
import { useCart } from "../contexts/CartContext";
import { useLocation } from "../context/LocationContext";
import { useLang } from "../i18n/LanguageContext";

function ProductCard({ product }: { product: CustomerProduct }) {
  const { t } = useLang();
  const { items, addItem } = useCart();
  const inCart = items.some((item) => item.product.id === product.id);

  return (
    <Card className="group w-[160px] shrink-0 hover:-translate-y-0.5 sm:w-[180px]">
      <Link href={`/product/${product.id}`}>
        <div className={`flex h-28 items-center justify-center rounded-t-card bg-gradient-to-br ${product.image}`}>
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 text-gray-700 backdrop-blur-sm ring-1 ring-inset ring-white/60 transition-transform duration-200 group-hover:scale-110">
            <span className="text-lg font-extrabold">{product.name.slice(0, 1)}</span>
          </span>
        </div>
      </Link>
      <CardBody className="flex flex-col gap-1.5 p-3">
        <Link href={`/product/${product.id}`} className="truncate font-display text-sm font-bold text-gray-900 hover:text-brand-700">
          {product.name}
        </Link>
        <p className="truncate text-xs text-gray-500">{product.unit}</p>
        <div className="flex items-center justify-between gap-2">
          <span className="font-display text-xs font-bold tabular-nums text-gray-900">₹{product.price}</span>
          <button
            type="button"
            onClick={() => addItem(product)}
            disabled={inCart || product.stock <= 0}
            aria-label={inCart ? t("Added to cart") : t("Add to cart")}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-700 transition-all duration-150 hover:bg-brand-600 hover:text-paper-50 active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={14} />
          </button>
        </div>
      </CardBody>
    </Card>
  );
}

export function TrendingProducts() {
  const { t } = useLang();
  const { selectedLocation } = useLocation();
  const [products, setProducts] = useState<CustomerProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    const load = async () => {
      if (!selectedLocation?.city) {
        return (await listProducts({ isAvailable: true, limit: 12 })).items;
      }
      const businesses = await listBusinesses({ city: selectedLocation.city, limit: 8 });
      const responses = await Promise.all(
        businesses.items.map((business) => listProducts({ businessId: business.id, isAvailable: true, limit: 8 }))
      );
      return responses.flatMap((response) => response.items);
    };

    load()
      .then((items) => {
        if (!cancelled) {
          const bestsellers = items.filter((product) => product.isBestseller);
          setProducts((bestsellers.length > 0 ? bestsellers : items).slice(0, 8));
        }
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
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
        <SectionHeading title={t("Trending Products")} />
        {isLoading ? (
          <div className="flex min-h-36 items-center justify-center text-brand-700" aria-label={t("Loading products")}>
            <Loader2 className="animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <p className="rounded-card border border-dashed border-paper-300 bg-surface p-6 text-center text-sm text-gray-600">
            {t("Products will appear here soon")}
          </p>
        ) : (
          <div className="stagger flex gap-3 overflow-x-auto pb-2 no-scrollbar sm:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
