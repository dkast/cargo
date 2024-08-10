"use client"

import { useEffect } from "react"
import { XOctagon } from "lucide-react"
import { useLogger } from "next-axiom"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Error({
  error
}: {
  error: Error & { digest?: string }
}) {
  const log = useLogger()

  useEffect(() => {
    console.error(error)
    log.error("Error in dashboard", error)
  }, [error, log])

  return (
    <div className="flex grow items-center justify-center px-2">
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
