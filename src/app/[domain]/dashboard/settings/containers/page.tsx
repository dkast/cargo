import { columns } from "@/app/[domain]/dashboard/settings/containers/columns"
import ContainerEdit from "@/app/[domain]/dashboard/settings/containers/container-edit"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { DataTable } from "@/components/ui/data-table/data-table"
import { getContainers } from "@/server/fetchers"
import { getCurrentUser } from "@/lib/session"
import { actionType } from "@/lib/types"

export const metadata: Metadata = {
  title: "Contenedores"
}

export default async function Page() {
  const user = await getCurrentUser()

  if (!user?.organizationId) {
    notFound()
  }

  const containers = await getContainers(user?.organizationId)

  return (
    <div className="mx-auto grow px-4 sm:px-6">
      <PageSubtitle
        title="Contenedores"
        description="Listado de contenedores para el registro de viajes"
      >
        <ContainerEdit
          organizationId={user.organizationId}
          action={actionType.CREATE}
        />
      </PageSubtitle>
      <div className="mt-6">
        <DataTable columns={columns} data={containers} />
      </div>
    </div>
  )
}
