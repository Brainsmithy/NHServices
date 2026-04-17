"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  viewportConfig,
} from "@/lib/animations";

const brandLogos = [
  {
    src: "/images/logos/reme-halo-logo.png",
    alt: "Reme Halo",
    className: "",
  },
  { src: "/images/logos/Navien_Logo.png", alt: "Navien", className: "" },
  {
    src: "/images/logos/honeywell-logo.png",
    alt: "Honeywell",
    className: "",
  },
  {
    src: "/images/logos/aprilaire-logo.png",
    alt: "AprilAire",
    className: "",
  },
  {
    src: "/images/logos/hd-fujitsu-logo.png",
    alt: "Fujitsu",
    className: "h-16 sm:h-20 md:h-24 max-w-[180px]",
  },
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
          <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-brand-dark-gray">
            TODO: services accordion lands in Sprint 1.5
          </div>
        </motion.div>

        <div className="w-full lg:w-1/2">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-10">
            <motion.div
              className="flex items-center justify-center gap-4 mb-8"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              <span className="text-lg sm:text-2xl font-bold">
                Authorized Dealer of:
              </span>
              <Image
                src="/images/logos/ruud-logo.png"
                alt="RUUD"
                width={160}
                height={64}
                style={{ width: "auto" }}
                className="h-14 sm:h-16 object-contain"
              />
            </motion.div>

            <div className="text-center mb-8">
              <div className="text-xl sm:text-2xl font-bold mb-2">
                Trusted Brands:
              </div>
              <div className="h-[2px] w-24 mx-auto bg-brand-gradient" />
            </div>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 place-items-center"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              {brandLogos.map((logo) => (
                <motion.div
                  key={logo.alt}
                  className="flex items-center justify-center bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow w-full"
                  variants={staggerItem}
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={200}
                    height={96}
                    style={{ width: "auto" }}
                    className={
                      logo.className ||
                      "h-12 sm:h-14 md:h-16 max-w-[160px] object-contain"
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
