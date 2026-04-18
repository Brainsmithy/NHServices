"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  viewportConfig,
} from "@/lib/animations";
import { ServiceAccordion } from "@/components/accordions/service-accordion";

const brandLogos = [
  { src: "/images/logos/reme-halo-logo.png", alt: "Reme Halo" },
  { src: "/images/logos/Navien_Logo.png", alt: "Navien" },
  { src: "/images/logos/honeywell-logo.png", alt: "Honeywell" },
  { src: "/images/logos/aprilaire-logo.png", alt: "AprilAire" },
  { src: "/images/logos/hd-fujitsu-logo.png", alt: "Fujitsu" },
];

export function ServicesSection() {
  return (
    <section id="services" className="bg-white text-brand-dark-gray">
      <div className="flex flex-col lg:flex-row px-6 sm:px-10 md:px-16 lg:px-24 py-12 gap-8 lg:gap-12">
        <motion.div
          className="w-full lg:w-1/2"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          style={{ overflow: "visible" }}
        >
          <ServiceAccordion />
        </motion.div>

        <div className="w-full lg:w-1/2">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-10">
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-10 text-center sm:text-left"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              <span className="text-base sm:text-xl md:text-2xl font-bold leading-tight">
                Authorized Dealer of
              </span>
              <div className="relative h-14 sm:h-16 w-32 sm:w-40 shrink-0">
                <Image
                  src="/images/logos/ruud-logo.png"
                  alt="RUUD"
                  fill
                  sizes="(max-width: 640px) 128px, 160px"
                  className="object-contain"
                />
              </div>
            </motion.div>

            <div className="text-center mb-8">
              <div className="text-xl sm:text-2xl font-bold mb-2">
                Trusted Brands
              </div>
              <div className="h-[2px] w-24 mx-auto bg-brand-gradient rounded-full" />
            </div>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              {brandLogos.map((logo) => (
                <motion.div
                  key={logo.alt}
                  className="flex items-center justify-center bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-brand-blue/40 transition h-20 sm:h-24"
                  variants={staggerItem}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      fill
                      sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 200px"
                      className="object-contain p-1"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
