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
import { SectionHeader } from "./section-header";

const brandLogos = [
  { src: "/images/logos/reme-halo-logo.png", alt: "Reme Halo" },
  { src: "/images/logos/Navien_Logo.png", alt: "Navien" },
  { src: "/images/logos/honeywell-logo.png", alt: "Honeywell" },
  { src: "/images/logos/aprilaire-logo.png", alt: "AprilAire" },
  { src: "/images/logos/hd-fujitsu-logo.png", alt: "Fujitsu" },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      className="bg-white text-brand-dark-gray py-20 px-6 sm:px-10 md:px-16 lg:px-20"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="What We Do"
          title="Services & Trusted Brands"
          description="Heating, cooling, water heaters, indoor air quality — installed, serviced, and maintained by techs who have done it for decades."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <motion.div
            className="lg:col-span-7"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            style={{ overflow: "visible" }}
          >
            <ServiceAccordion />
          </motion.div>

          <motion.div
            className="lg:col-span-5"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-gray-50 to-white shadow-md p-6 sm:p-8">
              <div className="flex items-center justify-center gap-4 pb-6 border-b border-gray-200">
                <span className="text-base sm:text-lg font-semibold text-brand-dark-gray">
                  Authorized Dealer of
                </span>
                <div className="relative h-12 w-28 sm:h-14 sm:w-32 shrink-0">
                  <Image
                    src="/images/logos/ruud-logo.png"
                    alt="RUUD"
                    fill
                    sizes="128px"
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="text-center mt-6 mb-5">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand-blue mb-2">
                  Equipment We Install
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-brand-dark-gray">
                  Trusted Brands
                </h3>
                <div className="h-1 w-16 mx-auto bg-brand-gradient mt-3 rounded-full" />
              </div>

              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
              >
                {brandLogos.map((logo) => (
                  <motion.div
                    key={logo.alt}
                    className="flex items-center justify-center bg-white rounded-xl p-3 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-0.5 hover:border-brand-blue/40 transition-all h-20 sm:h-24"
                    variants={staggerItem}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        fill
                        sizes="160px"
                        className="object-contain p-1"
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
