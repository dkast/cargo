import { columns } from "@/app/[domain]/dashboard/settings/containers/columns"
import ContainerEdit from "@/app/[domain]/dashboard/settings/containers/container-edit"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { DataTable } from "@/components/ui/data-table/data-table"
import { getContainers, getOrganizationBySubDomain } from "@/server/fetchers"
import { actionType } from "@/lib/types"

export const metadata: Metadata = {
  title: "Contenedores"
}

export default async function ContainersPage({
  params: { domain }
}: {
  params: { domain: string }
}) {
  const orgData = await getOrganizationBySubDomain(domain)

  if (!orgData) {
    notFound()
  }

  const containers = await getContainers(orgData.id)

  return (
    <div className="mx-auto grow px-4 sm:px-6">
      <PageSubtitle
        title="Contenedores"
        description="Listado de contenedores para el registro de viajes"
      >
        <ContainerEdit organizationId={orgData.id} action={actionType.CREATE} />
      </PageSubtitle>
      <div className="mt-6">
        <DataTable columns={columns} data={containers} />
      </div>
    </div>
  )
}
