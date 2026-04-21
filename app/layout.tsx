import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "./providers";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nhserviceshvac.com";

const SITE_NAME = "NH Services";
const SITE_TAGLINE = "HVAC in Colorado";
const TITLE_DEFAULT = `${SITE_NAME} — ${SITE_TAGLINE}`;
const DESCRIPTION =
  "Family-run HVAC service, installation, and maintenance in the Denver metro area. Heating, cooling, water heaters, and indoor air quality — done right by techs you can trust.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE_DEFAULT,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  keywords: [
    "HVAC",
    "Denver HVAC",
    "Furnace install",
    "Air conditioning",
    "Heating repair",
    "Water heater",
    "Indoor air quality",
    "NH Services",
    "Arvada HVAC",
    "Colorado HVAC",
  ],
  icons: {
    icon: [
      { url: "/nhservices-logo-svg.svg", type: "image/svg+xml" },
      {
        url: "/images/logos/nhservices-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/images/logos/nhservices-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/nhservices-logo-svg.svg",
    apple: [
      {
        url: "/images/logos/nhservices-logo.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE_DEFAULT,
    description: DESCRIPTION,
    images: [
      {
        url: "/images/van-pic.png",
        width: 1200,
        height: 630,
        alt: "NH Services HVAC van on a Colorado job site",
      },
      {
        url: "/images/logos/nhservices-logo.png",
        width: 520,
        height: 520,
        alt: "NH Services logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE_DEFAULT,
    description: DESCRIPTION,
    images: ["/images/van-pic.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "HVAC",
};

export const viewport: Viewport = {
  themeColor: "#54a0d7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
