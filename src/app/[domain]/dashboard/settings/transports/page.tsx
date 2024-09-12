import { columns } from "@/app/[domain]/dashboard/settings/transports/columns"
import TransportEdit from "@/app/[domain]/dashboard/settings/transports/transport-edit"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { DataTable } from "@/components/ui/data-table/data-table"
import { getCompanies } from "@/server/fetchers"
import { getOrganizationBySubDomain } from "@/server/fetchers/organization"
import { actionType } from "@/lib/types"

export const metadata: Metadata = {
  title: "Transportistas"
}

export default async function TransportsPage({
  params: { domain }
}: {
  params: { domain: string }
}) {
  const orgData = await getOrganizationBySubDomain(domain)

  if (!orgData) {
    notFound()
  }

  const companies = await getCompanies(orgData.id)

  return (
    <div className="mx-auto grow px-4 sm:px-6">
      <PageSubtitle
        title="Transportistas"
        description="Listado de transportistas para el registro de viajes"
      >
        <TransportEdit organizationId={orgData.id} action={actionType.CREATE} />
      </PageSubtitle>
      <div className="mt-6">
        <DataTable columns={columns} data={companies} />
      </div>
    </div>
  )
}
