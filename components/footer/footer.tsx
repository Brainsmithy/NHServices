"use client";

import Image from "next/image";
import { Button } from "@heroui/react";
import { motion } from "motion/react";
import { fadeInUp, viewportConfig } from "@/lib/animations";

const socialMediaLinks = [
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
];

export function Footer() {
  return (
    <footer className="bg-brand-dark-gray text-white py-8 px-4 sm:px-8">
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-center sm:items-start text-center sm:text-left px-6 sm:px-10 md:px-16 lg:px-24"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <div className="flex-1 w-full sm:w-auto">
          <div className="text-lg">NH Services, LLC.</div>
          <div className="mt-4">Monday - Friday</div>
          <div>8:00AM - 5:00PM</div>
          <div className="mt-4">7310 W. 52nd Ave. A-146</div>
          <div>Arvada, CO 80002</div>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 w-full sm:w-auto mt-4 sm:mt-0">
          <Button
            as="a"
            href="https://myqrcode.com/qr/be124a71/view"
            target="_blank"
            rel="noreferrer"
            className="w-32 h-32 sm:w-40 sm:h-40 relative overflow-hidden p-0 border-0 shadow-xl hover:shadow-2xl transition-shadow mt-4"
          >
            <Image
              src="/images/NHServices_QR_Code.svg"
              alt="Social Media QR Code"
              width={160}
              height={160}
              className="w-full h-full object-cover"
            />
          </Button>
          <span className="text-xl mt-2 mb-4">(Click or Scan!)</span>
          <div className="flex space-x-4 drop-shadow-lg mt-4 mb-4">
            {socialMediaLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={link.icon}
                  alt={link.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 hover:scale-110 transition-transform"
                />
              </a>
            ))}
          </div>
          <span>
            Built with love by{" "}
            <a
              href="https://brainsmithy.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold hover:text-brand-blue transition-colors"
            >
              Brainsmithy
            </a>
          </span>
        </div>

        <div className="flex flex-col items-center sm:items-end flex-1 w-full sm:w-auto mt-4 sm:mt-0">
          <div className="bg-white rounded-lg drop-shadow-lg p-2">
            <Image
              src="/images/logos/nhservices-logo.png"
              alt="NH Services"
              width={96}
              height={96}
              style={{ height: "auto" }}
              className="w-24"
            />
          </div>
          <a
            href="tel:303-905-1470"
            className="underline mt-4 text-lg font-semibold"
          >
            303-905-1470
          </a>
          <a
            href="mailto:nhserviceshvac@gmail.com"
            className="underline mt-2"
          >
            nhserviceshvac@gmail.com
          </a>
        </div>
      </motion.div>
    </footer>
  );
}
