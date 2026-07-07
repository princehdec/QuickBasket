import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/utils";

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white rounded-card border border-gray-100/80 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200",
        className
      )}
      {...props}
    />
  );
}

export function CardImage({
  children,
  className,
  ...props
}: { children?: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative h-36 w-full bg-gradient-to-br from-brand-50 via-brand-100 to-amber-50 overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />;
}
