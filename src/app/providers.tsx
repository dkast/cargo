"use client"

import { Suspense } from "react"
import { Toaster } from "react-hot-toast"
import { PhotoProvider } from "react-photo-view"
import { Provider } from "jotai"
import { SessionProvider } from "next-auth/react"
import { AppProgressBar as ProgressBar } from "next-nprogress-bar"

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider>
        <PhotoProvider>
          <Suspense fallback={null}>
            <ProgressBar
              color="#FF6500"
              options={{ showSpinner: false }}
              shallowRouting
              delay={200}
            />
          </Suspense>
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
        </PhotoProvider>
      </Provider>
    </SessionProvider>
  )
}

export default Providers
