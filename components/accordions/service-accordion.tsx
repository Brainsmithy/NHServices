"use client";

import { AccordionPanel } from "./accordion-panel";

const serviceItems = [
  {
    title: "Installation Services",
    content: (
      <ul className="list-disc ml-4 text-brand-dark-gray">
        <li>Furnace Installations</li>
        <li>Air Conditioner Installations</li>
        <li>Water Heater Installation</li>
        <li>Hybrid Water Heater Installation</li>
        <li>Tankless Water Heater Installation</li>
        <li>Ductless Mini Split Installation</li>
        <li>Heat Pump Installation</li>
        <li>Ductwork Installation and Repair</li>
        <li>Humidifier Installation</li>
        <li>Air Purifier Installation</li>
        <li>Smart Thermostat Installation</li>
      </ul>
    ),
  },
  {
    title: "Maintenance Services",
    content: (
      <ul className="list-disc ml-4 text-brand-dark-gray">
        <li>Maintenance for all Brands</li>
        <li>Ductwork Cleaning</li>
      </ul>
    ),
  },
  {
    title: "Real Estate Services",
    content: (
      <ul className="list-disc ml-4 text-brand-dark-gray">
        <li>Furnace and Air Conditioner Inspections</li>
        <li>Inspection Resolution Repairs</li>
        <li>Furnace Certifications</li>
      </ul>
    ),
  },
  {
    title: "Swamp Cooler Services",
    content: (
      <ul className="list-disc ml-4 text-brand-dark-gray">
        <li>Swamp Cooler Installation and Repairs</li>
        <li>Swamp Cooler Start Ups and Winterizing</li>
      </ul>
    ),
  },
];

export function ServiceAccordion() {
  return (
    <div className="mt-6 sm:mt-8 md:mt-12">
      <div className="text-2xl sm:text-3xl text-center mb-2 font-bold text-brand-dark-gray">
        Our Services
      </div>
      <div className="h-[2px] w-24 mx-auto bg-brand-gradient mb-4" />
      <AccordionPanel items={serviceItems} />
      <div className="section-divider sm:hidden mb-10" />
    </div>
  );
}
