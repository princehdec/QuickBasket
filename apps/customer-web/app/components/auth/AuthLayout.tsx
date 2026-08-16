import type { ReactNode } from "react";
import Link from "next/link";
import { ShoppingBasket } from "lucide-react";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="hero-wash flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2" aria-label="QuickBasket home">
        <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-brand-500 to-brand-700 text-paper-50 shadow-[0_3px_10px_-2px_rgb(18_50_30/0.45)] ring-1 ring-inset ring-white/25">
          <ShoppingBasket size={20} strokeWidth={2.4} />
        </span>
        <span className="font-display text-lg font-extrabold tracking-[-0.02em] text-gray-900">
          Quick<span className="text-brand-600">Basket</span>
        </span>
      </Link>

      <div className="mt-8 w-full max-w-sm animate-slide-up">
        <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        {subtitle && (
          <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{subtitle}</p>
        )}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
