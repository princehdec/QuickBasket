import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/utils";

/* ------------------------------------------------------------------ *
 * Button / ButtonLink — Kirana Modern
 * ------------------------------------------------------------------ *
 * Deep-green primary with a warm shadow, tactile press, visible focus
 * ring. Variant lanes mirror the colour system:
 *   primary  — brand green ( commerce actions )
 *   accent   — turmeric    ( offers & promo CTAs only )
 *   khata    — ledger red  ( khata credit actions only )
 * ------------------------------------------------------------------ */

type Variant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost"
  | "outline"
  | "accent"
  | "khata";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-display font-bold tracking-tight rounded-button transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-paper-50 shadow-[0_2px_10px_-2px_rgb(18_50_30/0.45)] hover:bg-brand-700 hover:shadow-[0_4px_14px_-4px_rgb(18_50_30/0.5)]",
  secondary: "bg-brand-100 text-brand-800 hover:bg-brand-200",
  tertiary:
    "bg-surface text-gray-800 border border-paper-300 hover:border-paper-400 hover:bg-paper-50",
  ghost: "bg-transparent text-gray-700 hover:bg-paper-200/60",
  outline:
    "bg-surface border border-brand-300 text-brand-700 hover:bg-brand-50 hover:border-brand-400",
  accent:
    "bg-turmeric-400 text-[#33230a] shadow-[0_2px_10px_-3px_rgb(134_80_14/0.5)] hover:bg-turmeric-500 hover:text-[#2c1e07]",
  khata:
    "bg-khata-600 text-khata-50 shadow-[0_2px_10px_-2px_rgb(115_38_29/0.45)] hover:bg-khata-700",
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
