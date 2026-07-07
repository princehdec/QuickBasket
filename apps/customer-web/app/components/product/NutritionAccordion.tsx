"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils";

type AccordionSection = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export function NutritionAccordion({
  ingredients,
  nutritionalInfo,
  storage,
  manufacturer,
  countryOfOrigin,
}: {
  ingredients: string[];
  nutritionalInfo: { label: string; value: string }[];
  storage: string;
  manufacturer: string;
  countryOfOrigin: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const sections: AccordionSection[] = [
    {
      id: "ingredients",
      title: "Ingredients",
      content: (
        <ul className="space-y-1">
          {ingredients.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
              {item}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "nutrition",
      title: "Nutritional Information",
      content: (
        <div className="divide-y divide-gray-100 rounded-lg border border-gray-100">
          {nutritionalInfo.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-2.5 text-sm"
            >
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "storage",
      title: "Storage Instructions",
      content: <p className="text-sm leading-relaxed text-gray-600">{storage}</p>,
    },
    {
      id: "manufacturer",
      title: "Manufacturer Details",
      content: (
        <div className="space-y-1 text-sm text-gray-600">
          <p>{manufacturer}</p>
          <p>Country of Origin: {countryOfOrigin}</p>
        </div>
      ),
    },
  ];

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section>
      <h2 className="text-base font-bold text-gray-900">Product Details</h2>
      <div className="mt-2 divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white">
        {sections.map((section) => {
          const isOpen = openId === section.id;
          return (
            <div key={section.id}>
              <button
                type="button"
                onClick={() => toggle(section.id)}
                className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
              >
                {section.title}
                {isOpen ? (
                  <ChevronDown size={16} className="text-gray-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-400" />
                )}
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  isOpen ? "max-h-96 pb-4" : "max-h-0"
                )}
              >
                <div className="px-4">{section.content}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
