import { AlertCircle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AlertDue({
  isDue,
  className
}: {
  isDue: boolean
  className?: string
}) {
  if (!isDue) return null

  return (
    <div className={className}>
      <Alert variant="warning">
        <AlertCircle className="size-4" />
        <AlertTitle>Acción requerida</AlertTitle>
        <AlertDescription>
          La suscripción de su organización está vencida. Por favor, contacte a
          su administrador.
        </AlertDescription>
      </Alert>
    </div>
  )
}
