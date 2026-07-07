"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Construction } from "lucide-react";
import { products } from "../../../lib/mock/products";
import { stores } from "../../../lib/dummyStores";
import { categories } from "../../../lib/mock/categories";
import { getProductDetail } from "../../../lib/mock/productDetails";
import { ProductGallery } from "../../components/product/ProductGallery";
import { ProductInfo } from "../../components/product/ProductInfo";
import { ProductDescription } from "../../components/product/ProductDescription";
import { NutritionAccordion } from "../../components/product/NutritionAccordion";
import { RelatedProducts } from "../../components/product/RelatedProducts";
import { BoughtTogether } from "../../components/product/BoughtTogether";
import { StickyPurchaseBar } from "../../components/product/StickyPurchaseBar";
import { Button } from "../../components/ui/Button";

export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const product = products.find((p) => p.id === productId);
  const detail = product ? getProductDetail(productId) : null;
  const store = product ? stores.find((s) => s.id === product.storeId) : null;
  const category = product
    ? categories.find((c) => c.id === product.categoryId)
    : null;

  if (!product || !detail) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8F9FA] px-4 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <Construction size={36} />
        </span>
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <p className="text-sm text-gray-500">
          The product you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        <Link href="/stores">
          <Button variant="outline" size="md">
            Browse Stores
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 md:pb-0">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-12 max-w-7xl items-center gap-1.5 px-4 text-sm text-gray-500 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="transition-colors hover:text-brand-600"
          >
            Home
          </Link>
          <ChevronRight size={14} className="text-gray-300" />
          {store && (
            <>
              <Link
                href={`/store/${store.id}`}
                className="truncate transition-colors hover:text-brand-600"
              >
                {store.name}
              </Link>
              <ChevronRight size={14} className="text-gray-300" />
            </>
          )}
          {category && (
            <>
              <span className="text-gray-400">{category.name}</span>
              <ChevronRight size={14} className="text-gray-300" />
            </>
          )}
          <span className="truncate font-medium text-gray-900">
            {product.name}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left — Gallery */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={detail.images} name={product.name} />
          </div>

          {/* Right — Info */}
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

        {/* Similar Products */}
        <div className="mt-10">
          <RelatedProducts productIds={detail.similarProductIds} />
        </div>

        {/* Frequently Bought Together */}
        <div className="mt-8">
          <BoughtTogether productIds={detail.boughtTogetherIds} />
        </div>
      </div>

      {/* Sticky Purchase Bar (mobile only) */}
      <StickyPurchaseBar product={product} detail={detail} />
    </div>
  );
}
