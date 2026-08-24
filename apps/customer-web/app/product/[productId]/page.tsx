"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Construction, Loader2, ChevronRight } from "lucide-react";
import { getBusiness, getProduct, listProducts, toCustomerStore, type CustomerProduct, type CustomerStore } from "../../../lib/api";
import type { ProductDetail } from "../../../lib/mock/productDetails";
import { ProductGallery } from "../../components/product/ProductGallery";
import { ProductInfo } from "../../components/product/ProductInfo";
import { ProductDescription } from "../../components/product/ProductDescription";
import { NutritionAccordion } from "../../components/product/NutritionAccordion";
import { RelatedProducts } from "../../components/product/RelatedProducts";
import { BoughtTogether } from "../../components/product/BoughtTogether";
import { StickyPurchaseBar } from "../../components/product/StickyPurchaseBar";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { useLang } from "../../i18n/LanguageContext";

function toLiveDetail(product: CustomerProduct): ProductDetail {
  const stockStatus = product.stock <= 0 ? "out_of_stock" : product.stock <= 5 ? "low_stock" : "in_stock";
  return {
    id: product.id,
    brand: product.brand ?? "",
    description: product.description ?? "Product details will be updated by the local partner.",
    rating: 0,
    reviewsCount: 0,
    stockStatus,
    stockCount: product.stock,
    images: product.images.length > 0 ? product.images : [product.image],
    ingredients: [],
    nutritionalInfo: [],
    storage: "Store according to the instructions on the product pack.",
    manufacturer: product.brand ?? "Local partner",
    countryOfOrigin: "India",
    similarProductIds: [],
    boughtTogetherIds: [],
  };
}

export default function ProductPage() {
  const { t } = useLang();
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<CustomerProduct | null>(null);
  const [store, setStore] = useState<CustomerStore | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<CustomerProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getProduct(productId)
      .then(async (nextProduct) => {
        const [business, productsResult] = await Promise.all([
          getBusiness(nextProduct.businessId),
          listProducts({ businessId: nextProduct.businessId, isAvailable: true, limit: 50 }),
        ]);
        if (cancelled) return;
        setProduct(nextProduct);
        setStore(toCustomerStore(business));
        setRelatedProducts(productsResult.items.filter((item) => item.id !== nextProduct.id));
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setProduct(null);
          setStore(null);
          setRelatedProducts([]);
          setError(cause instanceof Error ? cause.message : "Unable to load this product");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const detail = useMemo(() => (product ? toLiveDetail(product) : null), [product]);

  if (isLoading) {
    return (
      <div className="hero-wash flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-brand-700" aria-label={t("Loading product")} />
      </div>
    );
  }

  if (!product || !detail) {
    return (
      <div className="hero-wash flex min-h-screen flex-col items-center justify-center px-4">
        <EmptyState
          icon={Construction}
          title={t("Product not found")}
          description={error ?? t("The product you're looking for doesn't exist or may have been removed.")}
          action={
            <Link href="/stores">
              <Button variant="outline" size="md">
                <ArrowLeft size={16} />
                {t("Browse Stores")}
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="border-b border-paper-200/80 bg-surface">
        <div className="mx-auto flex h-12 max-w-7xl items-center gap-1.5 px-4 text-sm text-gray-600 sm:px-6 lg:px-8">
          <Link href="/" className="transition-colors hover:text-brand-700">{t("Home")}</Link>
          <ChevronRight size={14} className="text-paper-400" />
          {store && (
            <>
              <Link href={`/store/${store.id}`} className="truncate transition-colors hover:text-brand-700">{store.name}</Link>
              <ChevronRight size={14} className="text-paper-400" />
            </>
          )}
          {product.categoryName && (
            <>
              <span className="text-gray-500">{product.categoryName}</span>
              <ChevronRight size={14} className="text-paper-400" />
            </>
          )}
          <span className="truncate font-semibold text-gray-900">{product.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full lg:sticky lg:top-24 lg:self-start lg:w-1/2">
            <ProductGallery images={detail.images} name={product.name} />
          </div>
          <div className="w-full lg:w-1/2">
            <div className="space-y-8">
              <ProductInfo product={product} detail={detail} />
              <ProductDescription description={detail.description} />
              <NutritionAccordion
                ingredients={detail.ingredients}
                nutritionalInfo={detail.nutritionalInfo}
                storage={detail.storage}
                manufacturer={detail.manufacturer}
                countryOfOrigin={detail.countryOfOrigin}
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <RelatedProducts products={relatedProducts.slice(0, 8)} />
        </div>
        <div className="mt-8">
          <BoughtTogether products={relatedProducts.slice(0, 4)} />
        </div>
      </div>

      <StickyPurchaseBar product={product} detail={detail} />
    </div>
  );
}
