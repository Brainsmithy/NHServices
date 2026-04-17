import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { AppNavbar } from "@/components/navbar/app-navbar";

export const metadata: Metadata = {
  title: "NH Services — HVAC in Colorado",
  description:
    "Family-run HVAC service, installation, and maintenance in the Denver metro area.",
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
        </Providers>
      </body>
    </html>
  );
}
