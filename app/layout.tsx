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
    "An independent website preview for Thai Pattana Global Commercial Bank PCL. This site is not connected to real banking or payment services.",
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
          <strong>Independent service preview</strong>
          <span>This website is not connected to a licensed bank or payment network. Do not enter real personal or banking credentials. No real accounts or funds are created or processed.</span>
        </div>
        {children}
      </body>
    </html>
  );
}
