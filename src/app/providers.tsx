"use client"

import { Toaster } from "react-hot-toast"
import { Provider } from "jotai"
import { SessionProvider } from "next-auth/react"

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider>
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
      </Provider>
    </SessionProvider>
  )
}

export default Providers
