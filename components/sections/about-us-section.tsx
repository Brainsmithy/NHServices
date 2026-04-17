"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { fadeInLeft, fadeInRight, viewportConfig } from "@/lib/animations";

export function AboutUsSection() {
  return (
    <section
      id="aboutus"
      className="flex flex-col sm:flex-row bg-brand-light-gray text-brand-dark-gray py-12 px-6 sm:px-10 md:px-16 lg:px-24 gap-8 items-center"
    >
      <motion.div
        className="w-full sm:w-[45%] flex justify-center"
        variants={fadeInLeft}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl shadow-xl border-l-4 border-brand-blue overflow-hidden">
          <Image
            src="/images/team.jpeg"
            alt="NH Services team"
            fill
            sizes="(max-width: 640px) 100vw, 45vw"
            className="object-cover"
          />
        </div>
      </motion.div>

      <motion.div
        className="w-full sm:w-[55%] text-md sm:text-lg"
        variants={fadeInRight}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center sm:text-left mb-2">
          About Us
        </h2>
        <div className="h-[3px] w-24 mx-auto sm:mx-0 bg-brand-gradient mb-6 rounded-full" />
        <div className="space-y-4 leading-relaxed">
          <p>
            We&apos;re a local, family-run business with over 29 years of
            hands-on experience. When it comes to your repairs or
            installations, we&apos;ve got your back!
          </p>
          <p>
            With NH Services, it&apos;s all about you. We take the time to
            listen and understand your needs, ensuring we offer the best
            solutions tailored just for you. No pushy sales tactics here –
            our team is focused on delivering honest, reliable service
            without any hidden agendas.
          </p>
          <p>
            Plus, our technicians? They&apos;re not in it for the commission.
            They&apos;re here because they genuinely care about doing a great
            job for you. And as for pricing? We keep it fair and transparent,
            because we believe everyone deserves quality service at a
            reasonable price.
          </p>
          <p>
            So, if you&apos;re looking for a team you can trust to get the
            job done right, look no further. We&apos;re here to help, every
            step of the way!
          </p>
        </div>
      </motion.div>
    </section>
  );
}
