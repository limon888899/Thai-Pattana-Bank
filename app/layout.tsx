import "./globals.css";
import { Fraunces, Inter } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: "Thai Pattana Global Commercial Bank PCL | Banking for a Growing Thailand",
  description:
    "A modern Thai financial institution helping individuals, families, and businesses thrive with confident banking, protection, and long-term growth.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} font-sans bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
