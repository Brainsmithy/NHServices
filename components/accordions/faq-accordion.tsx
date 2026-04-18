"use client";

import { motion } from "motion/react";
import { fadeInUp, viewportConfig } from "@/lib/animations";
import { AccordionPanel } from "./accordion-panel";
import { SectionHeader } from "@/components/sections/section-header";

const faqItems = [
  {
    title: "How long does a furnace or air conditioner last?",
    content: (
      <span className="text-brand-dark-gray font-semibold">
        Average life expectancy of a furnace or air conditioner is 15-18 years.
      </span>
    ),
  },
  {
    title: "How often should we do maintenance on our equipment?",
    content: (
      <span className="text-brand-dark-gray font-semibold">Every year.</span>
    ),
  },
  {
    title: "How often should we change the air filter?",
    content: (
      <span className="text-brand-dark-gray font-semibold">
        Every 3 months or as needed.
      </span>
    ),
  },
  {
    title: "Should we have the air ducts cleaned?",
    content: (
      <span className="text-brand-dark-gray font-semibold">
        Yes, every 5-8 years.
      </span>
    ),
  },
  {
    title: "Are digital thermostats more energy efficient?",
    content: (
      <span className="text-brand-dark-gray font-semibold">
        Yes, they are more accurate and only run a selected amount of cycles per
        hour to improve efficiency.
      </span>
    ),
  },
];

export function FAQAccordion() {
  return (
    <div>
      <SectionHeader
        eyebrow="Quick Answers"
        title="Frequently Asked"
        description="The questions we hear most from homeowners."
      />
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        style={{ overflow: "visible" }}
      >
        <AccordionPanel items={faqItems} />
      </motion.div>
    </div>
  );
}
