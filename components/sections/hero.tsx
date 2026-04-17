"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import { motion } from "motion/react";
import { fadeInUp, scaleIn } from "@/lib/animations";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/van-pic.png"
          alt="NH Services service van parked at a Colorado job site"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/90" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center py-16 sm:py-20 md:py-28 lg:py-32 px-6">
        <Link href="/" className="nav-link">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="drop-shadow-lg"
          >
            <Image
              src="/images/logos/nhservices-logo.png"
              alt="NH Services"
              width={520}
              height={520}
              priority
              style={{ width: "auto" }}
              className="h-28 sm:h-36 md:h-44 lg:h-52"
            />
          </motion.div>
        </Link>

        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-brand-dark-gray mt-6 sm:mt-8 drop-shadow-sm max-w-4xl"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          Proudly Serving The Denver Metro Area Since 2010
        </motion.h1>

        <motion.div
          className="h-[3px] w-32 sm:w-40 bg-brand-gradient mt-4 rounded-full"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        />

        <motion.div
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <Button
            size="lg"
            onPress={() =>
              console.log(
                "[hero] contact modal wiring lands in sprint 1.6"
              )
            }
            className="h-12 px-6 text-white font-semibold text-md drop-shadow-lg bg-brand-gradient"
          >
            Get An Estimate!
          </Button>

          <Button
            as="a"
            href="https://www.synchrony.com/mmc/M9229374400"
            target="_blank"
            rel="noreferrer"
            className="h-10 sm:h-12 text-[#3B3D44] font-semibold text-sm sm:text-md drop-shadow-md bg-brand-yellow hover:bg-[#3B3D44] hover:text-brand-yellow active:bg-brand-yellow border-1 border-black hover:border-brand-yellow rounded-lg px-4"
          >
            Financing Available!
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
