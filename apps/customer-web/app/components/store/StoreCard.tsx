import Link from "next/link";
import { ArrowRight, Clock, MapPin, ShoppingBag, Star } from "lucide-react";
import { Card, CardBody } from "../ui/Card";
import { Badge } from "../ui/Badge";
import type { Store } from "../../../lib/dummyStores";

export function StoreCard({ store }: { store: Store }) {
  return (
    <Card className="group overflow-hidden hover:-translate-y-0.5">
      <div className={`relative h-32 bg-gradient-to-br ${store.bannerGradient}`}>
        {store.isOpen && (
          <Badge variant="accent" className="pointer-events-none absolute left-3 top-3">
            Open
          </Badge>
        )}
        {!store.isOpen && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-gray-700/70 px-2.5 py-0.5 text-xs font-semibold text-paper-50 backdrop-blur">
            Closed
          </span>
        )}
        <div
          className={`absolute -bottom-5 left-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${store.logoGradient} shadow-md ring-4 ring-surface`}
          aria-hidden="true"
        >
          <ShoppingBag size={22} className="text-white" />
        </div>
      </div>

      <CardBody className="pt-10">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-bold text-gray-900">{store.name}</h3>
          <span className="inline-flex shrink-0 items-center gap-1 font-display text-sm font-bold tabular-nums text-gray-900">
            <Star size={14} className="fill-turmeric-400 text-turmeric-400" aria-hidden="true" />
            {store.rating}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
          <span className="inline-flex items-center gap-1">
            <Clock size={12} aria-hidden="true" />
            {store.deliveryTime}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} aria-hidden="true" />
            {store.distance}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-600">
          {store.description}
        </p>

        <div className="mt-3 text-xs text-gray-600 tabular-nums">
          Min {store.minOrder} &middot;{" "}
          {store.deliveryFee === "Free" ? "Free delivery" : `${store.deliveryFee} delivery`}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-paper-200/80 pt-3">
          <div className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${store.isOpen ? "bg-brand-500" : "bg-paper-300"}`}
              aria-hidden="true"
            />
            <span className={`text-xs font-semibold ${store.isOpen ? "text-brand-700" : "text-gray-500"}`}>
              {store.isOpen ? "Open" : "Closed"}
            </span>
          </div>
          <Link
            href={`/store/${store.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 transition-colors hover:text-brand-800"
          >
            Open Store
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
