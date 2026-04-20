"use client";

import { motion } from "motion/react";

const REVIEW_URL = "https://g.page/r/CVciggq2VQPCEBM/review";

function GoogleG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="#FBBC05" aria-hidden="true" className={className}>
      <path d="M10 1.5l2.7 5.47 6.04.88-4.37 4.26 1.03 6.01L10 15.27l-5.4 2.85 1.03-6.01L1.26 7.85l6.04-.88L10 1.5z" />
    </svg>
  );
}

export function GoogleReviewsBadge() {
  return (
    <motion.a
      href={REVIEW_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Review NH Services on Google (opens in a new tab)"
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="group absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2.5 sm:gap-4 rounded-full bg-black/90 backdrop-blur-sm pl-2.5 pr-4 sm:pl-[15px] sm:pr-5 py-2 sm:py-2.5 shadow-lg ring-1 ring-white/10 hover:shadow-xl hover:bg-black transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4285F4]"
    >
      <GoogleG className="h-[30px] w-[30px] sm:h-[35px] sm:w-[35px] shrink-0" />

      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className="text-[14px] sm:text-[15px] font-semibold text-white tracking-tight">
            Reviews
          </span>
          <div className="flex items-center gap-[1px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-[13px] w-[13px] sm:h-[15px] sm:w-[15px]" />
            ))}
          </div>
        </div>
        <span className="text-[13px] sm:text-[14px] text-[#8AB4F8] font-medium group-hover:underline">
          Leave a Review →
        </span>
      </div>
    </motion.a>
  );
}
