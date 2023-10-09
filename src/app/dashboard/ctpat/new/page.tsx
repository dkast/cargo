import CTPATMainForm from "@/app/dashboard/ctpat/new/ctpat-main-form"
import { Arrow } from "@radix-ui/react-dropdown-menu"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  getCompanies,
  getContainers,
  getOperators,
  getVehicles
} from "@/server/fetchers"
import { getCurrentUser } from "@/lib/session"

export default async function NewCTPATPage() {
  const user = await getCurrentUser()

  if (!user?.organizationId) {
    return (
      <div className="mx-auto max-w-2xl grow px-3 sm:px-0">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ocurrió un error</AlertTitle>
          <AlertDescription>
            El usuario no pertenece a una organización
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const companies = await getCompanies(user?.organizationId)
  const operators = await getOperators(user?.organizationId)
  const vehicles = await getVehicles(user?.organizationId)
  const containers = await getContainers(user?.organizationId)

  return (
    <div className="relative">
      <div className="mx-auto max-w-2xl grow px-3 py-4 sm:px-0 sm:py-8">
        <Link
          href="/dashboard/inspect"
          className="mb-2 inline-block rounded-full border border-gray-200 p-1 hover:bg-gray-50 sm:absolute sm:left-4 sm:top-8"
        >
          <span className="sr-only">Volver</span>
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <PageSubtitle
          title="Inspección CTPAT"
          description="Inspección 17 puntos criticos"
        />
        <CTPATMainForm
          companies={companies}
          operators={operators}
          vehicles={vehicles}
          containers={containers}
          organizationId={user.organizationId}
          membershipId={user.membershipId}
        />
      </div>
    </div>
  )
}
