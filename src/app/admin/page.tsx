import OrganizationDataTable from "@/app/admin/organization-datatable"
import { Building } from "lucide-react"
import type { Metadata } from "next/types"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { getOrganizations } from "@/server/fetchers/organization"

export const metadata: Metadata = {
  title: "Administración de organizaciones"
}

export default async function Page() {
  const organizations = await getOrganizations()

  return (
    <div className="mx-auto grow overflow-hidden px-4 sm:px-6">
      <PageSubtitle
        title="Organizaciones"
        description="Gestione las organizaciones en la plataforma"
        Icon={Building}
      />
      <div className="mt-6">
        <OrganizationDataTable data={organizations} />
      </div>
    </div>
  )
}
