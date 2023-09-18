import OrganizationForm from "@/app/dashboard/settings/organization-form"
import { MembershipRole } from "@prisma/client"
import { AlertTriangle } from "lucide-react"
import { type Metadata } from "next"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { prisma } from "@/server/db"
import { getCurrentUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Configuración"
}

export default async function SettingsPage() {
  const user = await getCurrentUser()

  const data = await prisma.organization.findFirst({
    where: {
      id: user?.organizationId
    }
  })

  if (!data) {
    //TODO: Add empty state
    return (
      <div className="mx-auto max-w-2xl grow px-3 sm:px-0">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Empresa no tiene datos</AlertTitle>
          <AlertDescription>
            Consulte al proveedor para la configuración de la Empresa
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl grow px-3 sm:px-0">
      <PageSubtitle
        title="Empresa"
        description="Información general de la empresa"
      />
      <OrganizationForm
        data={data}
        enabled={
          user?.role === MembershipRole.ADMIN ||
          user?.role === MembershipRole.OWNER
        }
      />
    </div>
  )
}
