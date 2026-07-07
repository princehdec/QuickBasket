import Link from "next/link";
import { Search, ShoppingBasket } from "lucide-react";
import { Container } from "./ui/Section";
import { ButtonLink } from "./ui/Button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <Container>
        <div className="flex h-[72px] items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label="QuickBasket home"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-button
                         bg-gradient-to-br from-brand-500 to-brand-600 text-white
                         shadow-md shadow-brand-500/30 transition-transform group-hover:scale-105"
              aria-hidden="true"
            >
              <ShoppingBasket size={20} strokeWidth={2.4} />
            </span>
            <span className="text-lg font-extrabold tracking-[-0.02em] text-gray-900">
              Quick<span className="text-brand-500">Basket</span>
            </span>
          </Link>

          <Link
            href="/search"
            className="hidden flex-1 max-w-md md:block"
            aria-label="Search"
          >
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <div
                className="flex h-10 w-full cursor-text items-center rounded-button border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-400 transition focus-within:border-brand-400 focus-within:outline-none focus-within:ring-4 focus-within:ring-brand-100"
              >
                Search for groceries, stores...
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              aria-label="Search"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-button
                         text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Search size={20} aria-hidden="true" />
            </Link>
            <ButtonLink href="/login" variant="outline" size="md">
              Login
            </ButtonLink>
          </div>
        </div>
      </Container>
    </header>
  );
}
