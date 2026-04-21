"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionPanelProps {
  items: AccordionItem[];
}

export function AccordionPanel({ items }: AccordionPanelProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index}>
            <button
              type="button"
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-black font-semibold">{item.title}</span>
              <FiChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="px-5 pb-4 bg-white">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
