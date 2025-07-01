import type React from "react";
import { Quantico } from "next/font/google";
import "./globals.css";

const quantico = Quantico({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-quantico",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={quantico.variable}>
      <body>{children}</body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};
