import { cn } from "../../../lib/utils";

/* ------------------------------------------------------------------ *
 * VegMark — Kirana Modern
 * ------------------------------------------------------------------ *
 * The Indian packaged-food veg / non-veg mark, drawn once and reused
 * everywhere instead of re-inlined dots at seven different sizes.
 * ------------------------------------------------------------------ */

const sizes = {
  sm: { box: "h-3.5 w-3.5", dot: "h-1.5 w-1.5" },
  md: { box: "h-4 w-4", dot: "h-2 w-2" },
  lg: { box: "h-5 w-5", dot: "h-2.5 w-2.5" },
} as const;

export function VegMark({
  isVeg = true,
  size = "md",
  className,
}: {
  isVeg?: boolean;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={isVeg ? "Vegetarian" : "Non-vegetarian"}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[3px] border-2 bg-white",
        isVeg ? "border-brand-600" : "border-khata-700",
        sizes[size].box,
        className
      )}
    >
      <span
        className={cn(
          "rounded-full",
          isVeg ? "bg-brand-600" : "bg-khata-700",
          sizes[size].dot
        )}
      />
    </span>
  );
}
