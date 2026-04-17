import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
