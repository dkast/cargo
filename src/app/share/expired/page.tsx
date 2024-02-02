import { CalendarX2 } from "lucide-react"
import type { Metadata } from "next"

import Logo from "@/components/logo"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "Vínculo expirado"
}

export default function ExpiredPage() {
  return (
    <div className="flex h-svh items-center justify-center">
      <div className="max-w-md px-4">
        <div className="my-8 flex items-center justify-center gap-2">
          <Logo className="size-10 fill-gray-900" />
          <h1 className="font-display text-2xl font-medium tracking-tight text-gray-900 sm:text-4xl">
            cargo
          </h1>
        </div>
        <Alert variant="destructive">
          <CalendarX2 className="size-4" />
          <AlertTitle>El vínculo ha expirado</AlertTitle>
          <AlertDescription>
            Por favor, solicite un nuevo vínculo para restablecer su contraseña
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
