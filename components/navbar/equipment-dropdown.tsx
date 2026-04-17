"use client";

import { useState, useRef, useEffect } from "react";

const HeatingPDF1 =
  "https://drive.google.com/file/d/1UmjAY6rJSB3H7qEB1FufwVqMNg0Jr5B0/view?usp=drive_link";
const HeatingPDF2 =
  "https://drive.google.com/file/d/1LSIlxIRN-Nw8Fq5LH2WRy9oUr8h2xdPp/view?usp=drive_link";
const HeatingPDF3 =
  "https://drive.google.com/file/d/1wAsphMUzxLNmbcQNm1zJ88zN8i5jP8lr/view?usp=drive_link";
const HeatingPDF4 =
  "https://drive.google.com/file/d/1Jrhf556iA9i576FyccL_z4E5zz2kzsXD/view?usp=drive_link";
const AirPurifierHalo =
  "https://drive.google.com/file/d/1nadm33Yu_CLgKhMGCi9bY9pXNuPMNJjv/view?usp=drive_link";
const NavienNPE2 =
  "https://drive.google.com/file/d/1QCkhVarOGhA2Ji0UjAiGCC8HcCg6D9Kr/view?usp=drive_link";
const RA13NZ =
  "https://drive.google.com/file/d/10YUeRT8Bc-bGYOMTTJbsHFQVSb122gm9/view?usp=drive_link";
const RA15AZ =
  "https://drive.google.com/file/d/1JFapxq0qq0B-5YBx1gEw5GOWhZkJwYJ9/view?usp=drive_link";

const equipmentData = [
  {
    name: "Heating",
    brochures: [
      { title: "RUUD - R801T Gas Furnace", pdf: HeatingPDF1 },
      { title: "RUUD - R802V Gas Furnace", pdf: HeatingPDF2 },
      { title: "RUUD - R921V Gas Furnace", pdf: HeatingPDF3 },
      { title: "RUUD - R962V Gas Furnace", pdf: HeatingPDF4 },
    ],
  },
  {
    name: "Air Conditioning",
    brochures: [
      { title: "RUUD - RA13NZ Air Conditioner", pdf: RA13NZ },
      { title: "RUUD - RA15AZ Air Conditioner", pdf: RA15AZ },
    ],
  },
  {
    name: "Air Purification",
    brochures: [{ title: "HALO-LED Air Purifier", pdf: AirPurifierHalo }],
  },
  {
    name: "Water Heaters",
    brochures: [{ title: "Navien - NPE-2 Water Heater", pdf: NavienNPE2 }],
  },
];

const EquipmentDropdown = () => {
  const [isEquipmentDropdownOpen, setIsEquipmentDropdownOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsEquipmentDropdownOpen(false);
        setOpenSubMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEquipmentButtonClick = () => {
    setIsEquipmentDropdownOpen(!isEquipmentDropdownOpen);
    setOpenSubMenu(null);
  };

  const handleSubMenuClick = (equipmentName: string) => {
    setOpenSubMenu(openSubMenu === equipmentName ? null : equipmentName);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        className="inline-flex justify-center w-full rounded-md py-2 sm:text-md font-medium text-gray-500 cursor-pointer"
        onClick={handleEquipmentButtonClick}
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
      {isEquipmentDropdownOpen && (
        <div className="sm:origin-top-right absolute mt-2 w-48 sm:w-56 max-w-[calc(100vw-2rem)] z-50 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {equipmentData.map((equipment, index) => (
              <div key={index}>
                <button
                  onClick={() => handleSubMenuClick(equipment.name)}
                  className="text-left px-8 py-2 text-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full flex justify-between items-center cursor-pointer"
                  role="menuitem"
                >
                  {equipment.name}
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
                {openSubMenu === equipment.name && (
                  <div>
                    {equipment.brochures.map((brochure, brochureIndex) => (
                      <div key={brochureIndex}>
                        <a
                          href={brochure.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                          {brochure.title}
                        </a>
                      </div>
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
