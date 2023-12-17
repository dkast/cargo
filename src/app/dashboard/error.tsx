"use client"

import { XOctagon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Error() {
  return (
    <div className="flex grow items-center justify-center">
      <Alert variant="destructive" className="mx-auto max-w-2xl">
        <XOctagon className="h-4 w-4" />
        <AlertTitle>Ocurrió un error</AlertTitle>
        <AlertDescription>
          Algo salió mal, por favor intente de nuevo más tarde
        </AlertDescription>
      </Alert>
    </div>
  )
}
