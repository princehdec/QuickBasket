import { ArrowRight } from "lucide-react";
import { Container, Section } from "./ui/Section";
import { ButtonLink } from "./ui/Button";

/* ------------------------------------------------------------------ *
 * StartShoppingCTA
 * ------------------------------------------------------------------ *
 * Closing call-to-action section. Large brand gradient card with a
 * white button on top. Decorative orbs for visual depth.
 * ------------------------------------------------------------------ */

export function StartShoppingCTA() {
  return (
    <Section className="pb-12 sm:pb-16">
      <Container>
        <div
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700
                     px-6 py-12 text-center shadow-lg sm:px-12 sm:py-14"
        >
          {/* Decorative blobs */}
          <span
            className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-white/8 blur-xl"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute -bottom-20 -right-8 h-48 w-48 rounded-full bg-black/8 blur-2xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-lg">
            <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
              Your basket, delivered in minutes
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">
              Fresh groceries from nearby stores, at your door in as
              little as 15 minutes.
            </p>

            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <ButtonLink
                href="/grocery"
                size="lg"
                className="w-full sm:w-auto bg-white text-brand-700 hover:bg-brand-50 shadow-xl shadow-brand-900/20"
              >
                Start Shopping
                <ArrowRight size={18} aria-hidden="true" />
              </ButtonLink>
              <span className="text-xs text-white/60">No account needed</span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}