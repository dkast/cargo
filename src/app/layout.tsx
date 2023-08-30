// import Providers from "@/app/providers"
import { Inter } from "next/font/google";

import "../styles/globals.css";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Cargo",
    default: "Cargo",
  },
  icons: {
    icon: "/favicon.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
    userScalable: false,
  },
  appleWebApp: {
    title: "Cargo",
  },
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${inter.variable}`}>
      <body className="bg-white text-zinc-950">
        {/* <Providers> */}
        <main className="flex min-h-screen flex-col">{children}</main>
        {/* </Providers> */}
      </body>
    </html>
  );
}
