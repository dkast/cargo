import { ShieldAlert } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AdminGuard() {
  return (
    <div className="mx-auto max-w-2xl grow px-4 sm:px-0">
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Permiso denegado</AlertTitle>
        <AlertDescription>
          No tiene permisos para acceder a esta página
        </AlertDescription>
      </Alert>
    </div>
  )
}
