"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  fadeInLeft,
  fadeInRight,
  scaleIn,
  staggerContainer,
  staggerItem,
  viewportConfig,
} from "@/lib/animations";
import { SectionHeader } from "./section-header";

const cities = [
  "Longmont",
  "Erie",
  "Broomfield",
  "Westminster",
  "Thornton",
  "Northglenn",
  "Federal Heights",
  "Commerce City",
  "Denver",
  "Aurora",
  "Centennial",
  "Parker",
  "Lone Tree",
  "Highlands Ranch",
  "Castle Rock",
];

function PinIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-brand-blue shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}

export function ServiceAreaSection() {
  return (
    <section
      id="servicearea"
      className="bg-gradient-to-b from-gray-50 via-white to-gray-50 text-brand-dark-gray py-20 px-6 sm:px-10 md:px-16 lg:px-20"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Where We Work"
          title="Proudly Serving the Denver Metro"
          description="From Longmont down to Castle Rock — if you're in the metro, we'll be there."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <motion.div
            className="lg:col-span-7"
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <div className="rounded-2xl bg-white border border-gray-200 shadow-md p-5 sm:p-7">
              <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center">
                <div className="relative w-full max-w-xs sm:w-56 mx-auto">
                  <Image
                    src="/images/longmont-to-castle-rock-map.png"
                    alt="Service map — Longmont to Castle Rock"
                    width={600}
                    height={800}
                    style={{ width: "auto", height: "auto" }}
                    className="max-h-[22rem] mx-auto rounded-xl object-contain"
                  />
                </div>
                <motion.ul
                  className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:text-base"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportConfig}
                >
                  {cities.map((city) => (
                    <motion.li
                      key={city}
                      variants={staggerItem}
                      className="flex items-center gap-2 text-brand-dark-gray"
                    >
                      <PinIcon />
                      <span>{city}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-5"
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <div className="rounded-2xl bg-white border border-gray-200 shadow-md p-7 sm:p-9 text-center">
              <motion.div
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                className="flex justify-center"
              >
                <Image
                  src="/images/logos/bbb-logo.png"
                  alt="BBB Accredited Business"
                  width={320}
                  height={320}
                  style={{ width: "auto" }}
                  className="h-40 sm:h-48 md:h-56 rounded-xl object-contain"
                />
              </motion.div>

              <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-800 text-xs font-bold tracking-wide uppercase">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Licensed &amp; Insured · Colorado
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-dark-gray mt-5 leading-tight">
                Fully Licensed &amp; Insured in the State of Colorado
              </h3>
              <p className="mt-3 text-sm text-gray-600">
                Accredited by the Better Business Bureau — a small operation
                you can trust with your home.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
