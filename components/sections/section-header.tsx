"use client";

import { motion } from "motion/react";
import { fadeInUp, viewportConfig } from "@/lib/animations";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: Props) {
  const isCenter = align === "center";
  return (
    <motion.div
      className={`mb-10 ${isCenter ? "text-center max-w-2xl mx-auto" : "text-left max-w-2xl"}`}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand-blue mb-3">
        {eyebrow}
      </p>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark-gray leading-tight">
        {title}
      </h2>
      <div
        className={`h-1 w-20 bg-brand-gradient mt-4 rounded-full ${
          isCenter ? "mx-auto" : ""
        }`}
      />
      {description && (
        <p className="mt-5 text-gray-600 leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
}
