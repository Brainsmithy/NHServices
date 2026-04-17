"use client";

import { useState, useRef, useEffect } from "react";

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

const EquipmentDropdown = ({ categories }: Props) => {
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
        className="inline-flex justify-center w-full rounded-md py-2 sm:text-md font-medium text-gray-500 cursor-pointer"
        onClick={() => {
          setIsOpen((v) => !v);
          setOpenSubMenu(null);
        }}
      >
        Equipment
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5 10l5 5 5-5H5z" />
        </svg>
      </button>
      {isOpen && (
        <div className="sm:origin-top-right absolute mt-2 w-48 sm:w-56 max-w-[calc(100vw-2rem)] z-50 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {categories.map((group) => (
              <div key={group.name}>
                <button
                  onClick={() =>
                    setOpenSubMenu(
                      openSubMenu === group.name ? null : group.name,
                    )
                  }
                  className="text-left px-8 py-2 text-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full flex justify-between items-center cursor-pointer"
                  role="menuitem"
                >
                  {group.name}
                  <svg
                    className="w-5 h-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openSubMenu === group.name && (
                  <div>
                    {group.brochures.map((b) => (
                      <a
                        key={b.id}
                        href={b.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        {b.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentDropdown;
