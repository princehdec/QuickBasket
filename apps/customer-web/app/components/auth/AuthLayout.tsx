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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F9FA] px-4 py-12">
      <Link href="/" className="flex items-center gap-2" aria-label="QuickBasket home">
        <span className="flex h-10 w-10 items-center justify-center rounded-button bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/30">
          <ShoppingBasket size={20} strokeWidth={2.4} />
        </span>
        <span className="text-lg font-extrabold tracking-[-0.02em] text-gray-900">
          Quick<span className="text-brand-500">Basket</span>
        </span>
      </Link>

      <div className="mt-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        {subtitle && (
          <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{subtitle}</p>
        )}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
