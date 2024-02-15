import { Building } from "lucide-react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

import Logo from "@/components/logo"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getCurrentUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Redireccionando..."
}

export default async function AccessDeniedPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect(`/${user.organizationDomain}/dashboard`)
  }

  return (
    <div className="flex h-svh items-center justify-center">
      <div className="max-w-md px-4">
        <div className="my-8 flex items-center justify-center gap-2">
          <Logo className="size-10 fill-gray-900" />
          <h1 className="font-display text-2xl font-medium tracking-tight text-gray-900 sm:text-4xl">
            cargo
          </h1>
        </div>
        <Alert variant="information">
          <Building className="size-4" />
          <AlertTitle>Redireccionando a su organización</AlertTitle>
          <AlertDescription>
            Espere un momento mientras lo redireccionamos a su organización
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
