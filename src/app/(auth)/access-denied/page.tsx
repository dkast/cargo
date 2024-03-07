import { ShieldX } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import Logo from "@/components/logo"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Vínculo expirado"
}

export default function AccessDeniedPage() {
  return (
    <div className="flex h-svh items-center justify-center">
      <div className="flex max-w-md flex-col px-4">
        <div className="my-8 flex items-center justify-center gap-2">
          <Logo className="size-10 fill-gray-900 dark:fill-white" />
          <h1 className="font-display text-2xl font-medium tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            cargo
          </h1>
        </div>
        <Alert variant="destructive">
          <ShieldX className="size-4" />
          <AlertTitle>No tiene acceso a esta organización</AlertTitle>
          <AlertDescription>
            No tiene permisos para acceder a esta organización. Consulte al
            administrador
          </AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/login">Regresar</Link>
        </Button>
      </div>
    </div>
  )
}
