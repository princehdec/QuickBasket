import Link from "next/link";
import { ArrowRight, PackageOpen, Shirt, Utensils } from "lucide-react";
import { Container, Section, SectionHeading } from "./ui/Section";
import { Card } from "./ui/Card";

type Service = {
  name: string;
  href: string;
  available: boolean;
  icon: React.ReactNode;
  border: string;
  iconBg: string;
};

const services: Service[] = [
  {
    name: "Grocery",
    href: "/grocery",
    available: true,
    icon: <PackageOpen size={22} />,
    border: "border-l-brand-500",
    iconBg: "bg-brand-100 text-brand-700",
  },
  {
    name: "Food",
    href: "#",
    available: false,
    icon: <Utensils size={22} />,
    border: "border-l-turmeric-400",
    iconBg: "bg-turmeric-100 text-turmeric-700",
  },
  {
    name: "Laundry",
    href: "#",
    available: false,
    icon: <Shirt size={22} />,
    border: "border-l-info",
    iconBg: "bg-info/10 text-info",
  },
  {
    name: "Porter",
    href: "#",
    available: false,
    icon: <ArrowRight size={22} />,
    border: "border-l-paper-400",
    iconBg: "bg-paper-100 text-paper-700",
  },
];

function ServiceCardContent({ service }: { service: Service }) {
  return (
    <Card
      className={`h-full border-l-4 ${service.border} ${service.available ? "cursor-pointer group hover:-translate-y-0.5 hover:shadow-lift" : "opacity-80 cursor-default"}`}
    >
      <div className="flex h-full items-center gap-3 p-3 sm:gap-4 sm:p-4">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${service.iconBg}`}
          aria-hidden="true"
        >
          {service.icon}
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold text-gray-900">
            {service.name}
          </p>

          {service.available
            ? (
              <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-bold text-brand-600 transition-colors group-hover:text-brand-700">
                Order now
                <ArrowRight
                  size={12}
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            )
            : (
              <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-paper-200 bg-paper-100/70 px-2 py-0.5 text-[11px] font-semibold text-paper-600">
                <span className="h-1.5 w-1.5 rounded-full bg-paper-400" aria-hidden="true" />
                Coming Soon
              </span>
            )}
        </div>
      </div>
    </Card>
  );
}

export function ServicesGrid() {
  return (
    <Section>
      <Container>
        <SectionHeading title="Our Services" />
        <div className="stagger grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {services.map((service) =>
            service.available
              ? (
                <Link key={service.name} href={service.href} className="block">
                  <ServiceCardContent service={service} />
                </Link>
              )
              : (
                <div
                  key={service.name}
                  aria-disabled="true"
                  aria-label={`${service.name} (coming soon)`}
                  className="cursor-not-allowed"
                >
                  <ServiceCardContent service={service} />
                </div>
              )
          )}
        </div>
      </Container>
    </Section>
  );
}
