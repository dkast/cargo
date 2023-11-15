import { type Metadata, type Viewport } from "next"
import { Inter, Syne } from "next/font/google"

import "../styles/globals.css"

import Providers from "@/app/providers"

export const metadata: Metadata = {
  title: {
    template: "%s | Cargo",
    default: "Cargo"
  },
  icons: {
    icon: "/favicon.ico"
  },
  appleWebApp: {
    title: "Cargo"
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  userScalable: false
}

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
})

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne"
})

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html
      className={`${inter.variable} ${syne.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-white text-gray-950">
        <Providers>
          <main className="flex min-h-screen flex-col">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
