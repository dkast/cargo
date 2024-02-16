"use client"

import { Toaster } from "react-hot-toast"
import { PhotoProvider } from "react-photo-view"
import { Provider } from "jotai"
import { SessionProvider } from "next-auth/react"
import { AppProgressBar as ProgressBar } from "next-nprogress-bar"

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProgressBar
        color="#FF6500"
        options={{ showSpinner: false }}
        shallowRouting
        delay={200}
      />
      <SessionProvider>
        <Provider>
          <PhotoProvider>
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
    </>
  )
}

export default Providers
