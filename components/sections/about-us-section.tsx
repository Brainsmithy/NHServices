"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { fadeInLeft, fadeInRight, viewportConfig } from "@/lib/animations";
import { SectionHeader } from "./section-header";

const stats = [
  { label: "Years in business", value: "29+" },
  { label: "Family-run", value: "100%" },
  { label: "Denver metro served", value: "15 cities" },
];

export function AboutUsSection() {
  return (
    <section
      id="aboutus"
      className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50 text-brand-dark-gray py-20 px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Family-Run Since 1996"
          title="About NH Services"
          description="Honest, transparent HVAC service from a Denver-area team that genuinely cares about getting it right the first time."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <motion.div
            className="lg:col-span-5"
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
              <Image
                src="/images/team.jpeg"
                alt="NH Services team"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div
                className="absolute inset-x-0 bottom-0 h-1.5 bg-brand-gradient"
                aria-hidden="true"
              />
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-7 space-y-5 text-base sm:text-lg leading-relaxed"
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <p>
              We&apos;re a local, family-run business with over{" "}
              <span className="font-semibold text-brand-dark-gray">29 years</span>{" "}
              of hands-on experience. When it comes to your repairs or
              installations, we&apos;ve got your back.
            </p>
            <p>
              With NH Services, it&apos;s all about you. We take the time to
              listen and understand your needs, ensuring we offer the best
              solutions tailored just for you. No pushy sales tactics here —
              our team is focused on delivering honest, reliable service
              without any hidden agendas.
            </p>
            <p>
              Plus, our technicians? They&apos;re not in it for the commission.
              They&apos;re here because they genuinely care about doing a
              great job for you. And as for pricing? We keep it fair and
              transparent, because we believe everyone deserves quality
              service at a reasonable price.
            </p>

            <dl className="grid grid-cols-3 gap-3 sm:gap-4 pt-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <dt className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                    {s.label}
                  </dt>
                  <dd className="text-xl sm:text-2xl font-bold bg-brand-gradient bg-clip-text text-transparent">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
