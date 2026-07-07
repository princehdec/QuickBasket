"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Apple, ArrowRight, ChevronLeft, ChevronRight, Coffee, Cookie, Milk } from "lucide-react";
import { cn } from "../../lib/utils";
import { Container, Section } from "./ui/Section";
import { ButtonLink } from "./ui/Button";

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  gradient: string;
  decor: string;
};

const slides: Slide[] = [
  {
    id: "first-order",
    eyebrow: "Limited time",
    title: "20% OFF",
    description: "On your first grocery order",
    gradient: "from-brand-500 via-brand-600 to-brand-700",
    decor: "from-brand-300/30",
  },
  {
    id: "free-delivery",
    eyebrow: "Everyday",
    title: "Free Delivery",
    description: "On all orders above ₹199",
    gradient: "from-orange-500 via-rose-500 to-rose-600",
    decor: "from-rose-300/30",
  },
  {
    id: "fresh-produce",
    eyebrow: "Farm fresh",
    title: "Fresh Fruits & Vegetables",
    description: "Hand-picked daily from local farms",
    gradient: "from-amber-400 via-orange-500 to-brand-600",
    decor: "from-amber-300/30",
  },
];

const AUTOPLAY_MS = 5000;

const productIcons = [
  { icon: Apple, bg: "bg-white/15" },
  { icon: Milk, bg: "bg-white/15" },
  { icon: Cookie, bg: "bg-white/15" },
  { icon: Coffee, bg: "bg-white/15" },
];

export function OfferBanner() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    setActive((current) => {
      const next = (index + slides.length) % slides.length;
      return next === current ? current : next;
    });
  }, []);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (paused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setActive((c) => (c + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  return (
    <Section className="py-4 sm:py-6">
      <Container>
        <div
          className="relative overflow-hidden rounded-card shadow-lg"
          role="region"
          aria-roledescription="carousel"
          aria-label="Promotional offers"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative h-56 sm:h-64 lg:h-72">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                aria-hidden={index !== active}
                className={cn(
                  "absolute inset-0 bg-gradient-to-br flex items-center justify-between px-6 sm:px-10 lg:px-14 transition-all duration-500",
                  slide.gradient,
                  index === active
                    ? "opacity-100 z-10"
                    : "pointer-events-none opacity-0 z-0"
                )}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${slides.length}: ${slide.title}`}
              >
                <span
                  className={cn(
                    "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-xl",
                    slide.decor
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "pointer-events-none absolute -bottom-10 -left-6 h-44 w-44 rounded-full blur-2xl",
                    slide.decor
                  )}
                  aria-hidden="true"
                />

                <div className="relative z-10 max-w-[55%] text-white sm:max-w-[50%]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70">
                    {slide.eyebrow}
                  </p>
                  <h2 className="mt-1.5 text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
                    {slide.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/85 sm:text-base">
                    {slide.description}
                  </p>
                  <ButtonLink
                    href="/grocery"
                    variant="tertiary"
                    size="sm"
                    className="mt-4"
                  >
                    Shop Now
                    <ArrowRight size={14} aria-hidden="true" />
                  </ButtonLink>
                </div>

                <div
                  className="pointer-events-none relative z-10 hidden h-32 w-32 items-center justify-center sm:flex"
                  aria-hidden="true"
                >
                  <div className="grid grid-cols-2 gap-2.5">
                    {productIcons.map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <span
                          key={i}
                          className="flex h-13 w-13 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm text-white ring-1 ring-inset ring-white/20"
                        >
                          <Icon size={22} />
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={prev}
            aria-label="Previous offer"
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full
                       bg-white/15 p-2 text-white backdrop-blur-md transition
                       hover:bg-white/30 hover:scale-105 active:scale-95
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next offer"
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full
                       bg-white/15 p-2 text-white backdrop-blur-md transition
                       hover:bg-white/30 hover:scale-105 active:scale-95
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>

          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to offer ${index + 1}`}
                aria-current={index === active}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === active
                    ? "w-6 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/75"
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
