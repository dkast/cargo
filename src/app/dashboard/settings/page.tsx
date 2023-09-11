import OrganizationForm from "@/app/dashboard/settings/organization-form"
import { type Metadata } from "next"

import PageSubtitle from "@/components/dashboard/page-subtitle"
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
    return <div>Not found</div>
  }

  return (
    <div className="mx-auto max-w-2xl grow px-3 sm:px-0">
      <PageSubtitle
        title="Empresa"
        description="Información general de la empresa"
      />
      <OrganizationForm data={data} />
    </div>
  )
}
