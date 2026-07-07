import { ChevronDown, MapPin, Navigation } from "lucide-react";
import { Container, Section } from "./ui/Section";
import { Button } from "./ui/Button";

export function LocationSection() {
  return (
    <Section className="pt-4 pb-2 sm:pt-5 sm:pb-3">
      <Container>
        <div
          className="flex flex-col gap-3 rounded-card border border-gray-100 bg-white
                     p-4 shadow-md sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4
                     hover:shadow-lg transition-all duration-200"
        >
          <button
            type="button"
            className="flex flex-1 items-center gap-3.5 rounded-button
                       text-left transition-colors hover:bg-gray-50 -m-2 p-2"
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center
                         rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-sm"
              aria-hidden="true"
            >
              <MapPin size={20} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                Deliver to
              </p>
              <p className="mt-0.5 truncate text-sm font-semibold text-gray-900">
                Current Location
              </p>
              <p className="truncate text-xs text-gray-400">
                Select your address to see nearby stores
              </p>
            </div>

            <ChevronDown
              size={18}
              className="shrink-0 text-gray-400"
              aria-hidden="true"
            />
          </button>

          <span className="hidden h-10 w-px bg-gray-100 sm:block" aria-hidden="true" />

          <Button
            type="button"
            variant="outline"
            size="md"
            className="self-start sm:self-center gap-2"
          >
            <Navigation size={16} aria-hidden="true" />
            Change Address
          </Button>
        </div>
      </Container>
    </Section>
  );
}
