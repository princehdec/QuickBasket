import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/utils";

/* ------------------------------------------------------------------ *
 * Button / ButtonLink
 * ------------------------------------------------------------------ *
 * Clean, premium button system mapped to the QuickBasket brand.
 * Variants: primary | secondary | tertiary | ghost | outline
 * Uses :active scale-down for tactile feel (Lighthouse-friendly).
 * ------------------------------------------------------------------ */

type Variant = "primary" | "secondary" | "tertiary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-button transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-500 hover:bg-brand-600 text-white shadow-sm shadow-brand-500/20",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
  tertiary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  outline:
    "bg-white border border-brand-200 text-brand-700 hover:bg-brand-50 hover:border-brand-300",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

/* ---- Button ---- */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  href?: undefined;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---- ButtonLink (renders as <Link>) ---- */
type ButtonLinkProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  href: string;
  className?: string;
  "aria-label"?: string;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}