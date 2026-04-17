"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  fadeInLeft,
  fadeInUp,
  scaleIn,
  staggerContainer,
  staggerItem,
  viewportConfig,
} from "@/lib/animations";

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

export function ServiceAreaSection() {
  return (
    <section id="servicearea">
      <div className="flex flex-col sm:flex-row bg-white text-brand-dark-gray px-6 sm:px-10 md:px-16 lg:px-24 py-12 gap-8">
        <div className="flex flex-col sm:w-1/2">
          <div className="mb-2 text-center">
            <h1 className="text-3xl font-bold mt-8 sm:mt-4">
              Proudly Serving
            </h1>
            <div className="h-[2px] w-24 mx-auto bg-brand-gradient mt-2" />
          </div>
          <div className="w-full p-4 sm:gap-10 flex justify-center items-center">
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              className="mr-8 sm:mr-0"
            >
              <Image
                src="/images/longmont-to-castle-rock-map.png"
                alt="Service map — Longmont to Castle Rock"
                width={600}
                height={800}
                style={{ height: "auto", width: "auto" }}
                className="max-h-80 sm:max-h-[28rem] drop-shadow-xl rounded-xl object-contain"
              />
            </motion.div>
            <motion.ul
              className="list-disc ml-4 sm:ml-8 text-brand-dark-gray"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              {cities.map((city) => (
                <motion.li key={city} variants={staggerItem}>
                  {city}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>

        <div className="sm:mt-8 md:mt-12 sm:flex flex-col justify-center items-center sm:w-1/2">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="mx-auto"
          >
            <Image
              src="/images/logos/bbb-logo.png"
              alt="BBB Accredited Business"
              width={320}
              height={320}
              style={{ width: "auto" }}
              className="h-48 sm:h-56 md:h-64 rounded-xl object-contain"
            />
          </motion.div>
          <motion.h2
            className="text-3xl sm:w-3/4 text-red-600 font-bold text-center mt-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            Fully Licensed &amp; Insured in the State of Colorado!
          </motion.h2>
        </div>
      </div>
    </section>
  );
}
