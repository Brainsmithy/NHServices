import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "./providers";
import { AppNavbar } from "@/components/navbar/app-navbar";
import { Footer } from "@/components/footer/footer";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://nhservicesllc.com",
  ),
  title: {
    default: "NH Services — HVAC in Colorado",
    template: "%s | NH Services",
  },
  description:
    "Family-run HVAC service, installation, and maintenance in the Denver metro area.",
  openGraph: {
    title: "NH Services — HVAC in Colorado",
    description: "Family-run HVAC service, installation, and maintenance.",
    url: "/",
    siteName: "NH Services",
    images: [{ url: "/images/van-pic.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/nhservices-logo-svg.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppNavbar />
          {children}
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
