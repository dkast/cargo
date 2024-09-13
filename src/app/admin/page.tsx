import OrganizationDataTable from "@/app/admin/organization-datatable"
import { Building } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next/types"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Button } from "@/components/ui/button"
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
      >
        <Button asChild>
          <Link href="/admin/organization/new">Crear organización</Link>
        </Button>
      </PageSubtitle>
      <div className="mt-6">
        <OrganizationDataTable data={organizations} />
      </div>
    </div>
  )
}
