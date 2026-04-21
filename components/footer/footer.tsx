"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { fadeInUp, viewportConfig } from "@/lib/animations";

type SocialLink = {
  name: string;
  url: string;
  icon: string | React.ReactNode;
};

function YouTubeTile() {
  return (
    <svg
      viewBox="0 0 36 36"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-9 h-9 rounded-lg"
    >
      <rect width="36" height="36" rx="8" fill="#FF0000" />
      <path d="M14.5 12.5 v11 l9 -5.5 z" fill="#ffffff" />
    </svg>
  );
}

const socialMediaLinks: SocialLink[] = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/profile.php?id=100064849591688",
    icon: "/images/logos/facebook-icon.png",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/nhservicesllc",
    icon: "/images/logos/x-icon.png",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/nh_services_hvac",
    icon: "/images/logos/instagram-icon.png",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@NHServicesLLC",
    icon: <YouTubeTile />,
  },
];

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/60 mb-4">
      {children}
    </h3>
  );
}

export function Footer() {
  return (
    <footer className="bg-brand-dark-gray text-white">
      <div className="h-1 w-full bg-brand-gradient" aria-hidden="true" />

      <motion.div
        className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 py-14"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand column */}
          <div className="flex flex-col items-start gap-4">
            <div className="bg-white rounded-xl p-3 shadow-md">
              <div className="relative w-20 h-20">
                <Image
                  src="/images/logos/nhservices-logo.png"
                  alt="NH Services"
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">NH Services, LLC.</p>
              <p className="text-sm text-white/70 mt-1">
                Family-run HVAC in the Denver Metro.
              </p>
            </div>
          </div>

          {/* Contact column */}
          <div>
            <ColumnHeading>Get In Touch</ColumnHeading>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="tel:303-905-1470"
                  className="flex items-center gap-2 text-white hover:text-brand-blue transition-colors"
                >
                  <svg
                    className="h-4 w-4 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span className="font-semibold">(303) 905-1470</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:nhserviceshvac@gmail.com"
                  className="flex items-center gap-2 text-white/90 hover:text-brand-blue transition-colors break-all"
                >
                  <svg
                    className="h-4 w-4 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>nhserviceshvac@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-white/80">
                <svg
                  className="h-4 w-4 shrink-0 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>
                  7310 W. 52nd Ave. A-146
                  <br />
                  Arvada, CO 80002
                </span>
              </li>
              <li className="flex items-start gap-2 text-white/80">
                <svg
                  className="h-4 w-4 shrink-0 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>
                  Monday – Friday
                  <br />
                  8:00 AM – 5:00 PM
                </span>
              </li>
            </ul>
          </div>

          {/* Connect column */}
          <div>
            <ColumnHeading>Connect</ColumnHeading>
            <p className="text-sm text-white/80 mb-4">
              Follow us, or scan the QR code to find every channel in one tap.
            </p>
            <div className="flex items-center gap-3 mb-5">
              {socialMediaLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="rounded-lg overflow-hidden hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                >
                  {typeof link.icon === "string" ? (
                    <Image
                      src={link.icon}
                      alt={link.name}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-lg"
                    />
                  ) : (
                    link.icon
                  )}
                </a>
              ))}
            </div>
            <a
              href="https://myqrcode.mobi/qr/be124a71/view"
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-col items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-lg p-2 -m-2"
            >
              <div className="bg-white p-2 rounded-lg shadow-md group-hover:shadow-xl transition-shadow">
                <Image
                  src="/images/NHServices_QR_Code.svg"
                  alt="Scan to connect"
                  width={112}
                  height={112}
                  className="w-28 h-28"
                />
              </div>
              <span className="text-xs text-white/60 group-hover:text-white/90 transition-colors">
                Click or scan
              </span>
            </a>
          </div>

          {/* Quick links column */}
          <div>
            <ColumnHeading>Explore</ColumnHeading>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/#aboutus", label: "About Us" },
                { href: "/#services", label: "Services" },
                { href: "/#testimonials", label: "Testimonials" },
                { href: "/#servicearea", label: "Service Area" },
                { href: "/gallery", label: "Gallery" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-white/80 hover:text-brand-blue transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col items-center gap-4 text-xs text-white/50">
          <a
            href="https://brainsmithy.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-lg p-2 -m-2"
          >
            <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/50">
              Built by
            </span>
            <div className="relative h-14 w-32">
              <Image
                src="/images/logos/brainsmithy-stacked-logo-white.png"
                alt="Brainsmithy"
                fill
                sizes="128px"
                className="object-contain"
              />
            </div>
          </a>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-center text-white/50">
            <p>© {new Date().getFullYear()} NH Services, LLC. All rights reserved.</p>
            <span className="hidden sm:inline">·</span>
            <p>Licensed &amp; insured · Denver Metro, Colorado</p>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
