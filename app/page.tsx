"use client";

import { Button } from "@heroui/react";

const swatches = [
  { label: "brand-blue", hex: "#54a0d7", bg: "bg-brand-blue" },
  { label: "brand-orange", hex: "#e75909", bg: "bg-brand-orange" },
  { label: "brand-dark-gray", hex: "#5A5858", bg: "bg-brand-dark-gray" },
  { label: "brand-light-gray", hex: "#D9D9D9", bg: "bg-brand-light-gray" },
];

export default function HomePage() {
  return (
    <>
      <div className="section-divider" />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-gradient text-5xl font-bold">NH Services</h1>
        <p className="text-brand-dark-gray mt-4 text-lg">
          Tailwind v4 + HeroUI sanity check. The brand palette, gradients, and
          HeroUIProvider are live.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {swatches.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <div
                className={`${s.bg} h-20 w-full rounded-md shadow-sm`}
                aria-label={`${s.label} swatch`}
              />
              <span className="text-brand-dark-gray mt-2 text-sm font-medium">
                {s.label}
              </span>
              <span className="text-brand-dark-gray text-xs">{s.hex}</span>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Button className="bg-brand-gradient text-white">
            HeroUI sanity check
          </Button>
        </div>
      </main>
    </>
  );
}
