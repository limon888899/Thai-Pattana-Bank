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
    "Thai Pattana Global Commercial Bank PCL is a fully licensed international commercial bank offering secure digital banking, global wire transfers, and cross-border financial services worldwide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} font-sans bg-slate-50 text-slate-900`}>
        <div className="service-preview-notice" role="note">
          <strong>Fully Licensed International Bank</strong>
          <span>Authorized global banking portal. Perform secure online transactions, cross-border fund transfers, and international financial services integrated with global banking networks worldwide.</span>
        </div>
        {children}
      </body>
    </html>
  );
}
