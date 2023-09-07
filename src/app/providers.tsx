"use client"

import { Toaster } from "react-hot-toast"
import { SessionProvider } from "next-auth/react"

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff"
          }
        }}
      />
    </SessionProvider>
  )
}

export default Providers
