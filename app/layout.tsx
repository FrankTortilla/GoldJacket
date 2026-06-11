import type { Metadata } from "next";
import { Bebas_Neue, Figtree } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gold Jacket",
  description: "Build your legend. Earn your jacket.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${figtree.variable}`}>
      <body className="font-[var(--font-figtree)] antialiased">{children}</body>
    </html>
  );
}
