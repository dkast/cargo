import BackButton from "@/app/[domain]/dashboard/ctpat/[id]/back-button"
import CTPATMainForm from "@/app/[domain]/dashboard/ctpat/edit/new/ctpat-main-form"
import { AlertCircle } from "lucide-react"
import { type Metadata } from "next"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  getCompanies,
  getContainers,
  getLocations,
  getOperators,
  getVehicles
} from "@/server/fetchers"
import { getCurrentUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Nueva Inspección CTPAT"
}

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
  const locations = await getLocations(user?.organizationId, true)

  return (
    <div className="relative">
      <div className="mx-auto max-w-2xl grow px-4 py-4 sm:px-0 sm:py-8">
        <BackButton />
        <PageSubtitle
          title="Inspección CTPAT"
          description="Inspección 17 puntos criticos"
        />
        <CTPATMainForm
          companies={companies}
          operators={operators}
          vehicles={vehicles}
          containers={containers}
          locations={locations.map(location => ({
            ...location,
            description: location.description || ""
          }))}
          organizationId={user.organizationId}
          membershipId={user.membershipId}
        />
      </div>
    </div>
  )
}
