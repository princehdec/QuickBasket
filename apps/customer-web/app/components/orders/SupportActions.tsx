"use client";

import { Headphones, HelpCircle, Phone, Store, ShieldAlert } from "lucide-react";

const actions = [
  { id: "call-store", label: "Call Store", icon: Store, variant: "default" as const },
  { id: "call-partner", label: "Call Delivery Partner", icon: Phone, variant: "default" as const },
  { id: "help", label: "Help Center", icon: HelpCircle, variant: "ghost" as const },
  { id: "report", label: "Report Issue", icon: ShieldAlert, variant: "ghost" as const },
];

export function SupportActions({ hasPartner }: { hasPartner: boolean }) {
  const visible = hasPartner ? actions : actions.filter((a) => a.id !== "call-partner");

  return (
    <section>
      <h2 className="flex items-center gap-1.5 font-display text-base font-bold tracking-tight text-gray-900">
        <Headphones size={16} />
        Support
      </h2>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {visible.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-button border border-paper-200/70 bg-surface px-3 py-3 text-sm font-semibold text-gray-700 shadow-soft transition-all hover:border-paper-300 hover:bg-paper-100/60 active:scale-[0.98]"
            >
              <Icon size={15} className="text-brand-700" />
              {action.label}
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 text-center text-xs text-gray-500">
        Support buttons are UI placeholders
      </p>
    </section>
  );
}
