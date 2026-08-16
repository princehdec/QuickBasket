import Link from "next/link";
import { Search, ShoppingBasket } from "lucide-react";
import { Container } from "./ui/Section";
import { ButtonLink } from "./ui/Button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-paper-200/70 bg-surface/90 backdrop-blur-md supports-[backdrop-filter]:bg-surface/75 shadow-soft">
      <Container>
        <div className="flex h-[72px] items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label="QuickBasket home"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-[14px]
                         bg-gradient-to-br from-brand-500 to-brand-700 text-paper-50
                         shadow-[0_3px_10px_-2px_rgb(18_50_30/0.45)] ring-1 ring-inset ring-white/25
                         transition-transform duration-200 group-hover:scale-105 group-hover:-rotate-3"
              aria-hidden="true"
            >
              <ShoppingBasket size={20} strokeWidth={2.4} />
            </span>
            <span className="font-display text-xl font-extrabold tracking-[-0.02em] text-gray-900">
              Quick<span className="text-brand-600">Basket</span>
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
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-400"
                aria-hidden="true"
              />
              <div
                className="flex h-10 w-full cursor-text items-center rounded-full border border-paper-200 bg-paper-50 pl-10 pr-3 text-sm text-paper-500 transition focus-within:border-brand-400 focus-within:bg-surface focus-within:outline-none focus-within:ring-4 focus-within:ring-brand-100"
              >
                Search for groceries, stores...
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              aria-label="Search"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full
                         text-gray-700 hover:bg-paper-200/70 transition-colors"
            >
              <Search size={20} aria-hidden="true" />
            </Link>
            <ButtonLink href="/login" variant="primary" size="md">
              Login
            </ButtonLink>
          </div>
        </div>
      </Container>
    </header>
  );
}
