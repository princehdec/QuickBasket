import Link from "next/link";
import { Heart, Mail, MessageCircle, Send, ShoppingBasket } from "lucide-react";
import { Container } from "./ui/Section";

const footerLinks = [
  {
    heading: "Quick Links",
    links: [
      { label: "Grocery", href: "/grocery" },
      { label: "Offers", href: "#" },
      { label: "Nearby Stores", href: "#" },
      { label: "My Orders", href: "#" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Contact Us", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <Container>
        <div className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4 lg:grid-cols-5 sm:py-14">
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2" aria-label="QuickBasket home">
              <span className="flex h-9 w-9 items-center justify-center rounded-button bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-sm shadow-brand-500/20">
                <ShoppingBasket size={18} aria-hidden="true" />
              </span>
              <span className="text-base font-extrabold tracking-[-0.02em] text-gray-900">
                Quick<span className="text-brand-500">Basket</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500">
              Fresh groceries from local stores, delivered to your door in minutes.
              QuickBasket — everything, delivered fast.
            </p>

            <div className="mt-5 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-brand-100 hover:text-brand-600 cursor-pointer">
                <MessageCircle size={16} />
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-brand-100 hover:text-brand-600 cursor-pointer">
                <Heart size={16} />
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-brand-100 hover:text-brand-600 cursor-pointer">
                <Send size={16} />
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Visa
              </span>
              <span className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                MC
              </span>
              <span className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                UPI
              </span>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {group.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 transition-colors hover:text-brand-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Stay Updated
            </h3>
            <div className="mt-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  aria-label="Email for newsletter"
                  className="h-10 min-w-0 flex-1 rounded-l-button border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
                <button
                  type="button"
                  aria-label="Subscribe"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-r-button bg-brand-500 text-white transition-colors hover:bg-brand-600"
                >
                  <Mail size={16} />
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Get updates on offers and new features.
              </p>
            </div>

            <div className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Download
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <span className="text-sm text-gray-500 cursor-default">App Store</span>
                </li>
                <li>
                  <span className="text-sm text-gray-500 cursor-default">Google Play</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 py-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} QuickBasket. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
