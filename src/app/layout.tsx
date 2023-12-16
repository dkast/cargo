import { type Metadata, type Viewport } from "next"
import { Inter, Outfit } from "next/font/google"

import "../styles/globals.css"
import "react-photo-view/dist/react-photo-view.css"

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

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit"
})

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html
      className={`${inter.variable} ${outfit.variable}`}
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
