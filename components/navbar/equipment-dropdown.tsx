"use client";

import { useState, useRef, useEffect } from "react";
import { useBrochures } from "@/lib/use-brochures";

export type BrochureLink = {
  id: string;
  title: string;
  url: string;
};

export type BrochureCategoryGroup = {
  name: string;
  brochures: BrochureLink[];
};

type Props = {
  categories: BrochureCategoryGroup[];
};

const ChevronDown = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

const EquipmentDropdown = ({ categories: initialCategories }: Props) => {
  const { data: categories } = useBrochures(initialCategories);
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setOpenSubMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (categories.length === 0) return null;

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md py-2 sm:text-md font-medium text-gray-500 cursor-pointer hover:text-brand-blue transition-colors"
        onClick={() => {
          setIsOpen((v) => !v);
          setOpenSubMenu(null);
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Equipment
        <ChevronDown
          className={`ml-1.5 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div
          className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] z-50 rounded-lg shadow-xl bg-white ring-1 ring-black/5 overflow-hidden"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1 max-h-[70vh] overflow-y-auto">
            {categories.map((group) => {
              const isExpanded = openSubMenu === group.name;
              return (
                <div key={group.name} className="border-b border-gray-100 last:border-b-0">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenSubMenu(isExpanded ? null : group.name)
                    }
                    className={`w-full flex justify-between items-center text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-brand-blue transition-colors cursor-pointer ${
                      isExpanded ? "bg-gray-50 text-brand-blue" : ""
                    }`}
                    role="menuitem"
                    aria-expanded={isExpanded}
                  >
                    <span className="break-words pr-2">{group.name}</span>
                    <ChevronDown
                      className={`shrink-0 w-4 h-4 text-gray-400 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="bg-gray-50/50">
                      {group.brochures.map((b) => (
                        <a
                          key={b.id}
                          href={b.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-6 py-2 text-sm text-gray-600 hover:bg-white hover:text-brand-blue break-words leading-snug"
                          role="menuitem"
                        >
                          {b.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentDropdown;
