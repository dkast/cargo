import CTPATMainForm from "@/app/dashboard/inspect/new/ctpat-main-form"
import { AlertCircle } from "lucide-react"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getCompanies } from "@/server/fetchers"
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

  return (
    <div className="mx-auto max-w-2xl grow px-3 sm:px-0">
      <PageSubtitle
        title="Inspección CTPAT"
        description="Realice una nueva inspección CTPAT"
      />
      <CTPATMainForm
        companies={companies}
        organizationId={user.organizationId}
      />
    </div>
  )
}
