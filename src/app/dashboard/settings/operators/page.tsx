import { columns } from "@/app/dashboard/settings/operators/columns"
import OperatorEdit from "@/app/dashboard/settings/operators/operator-edit"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { DataTable } from "@/components/ui/data-table/data-table"
import { getOperators } from "@/server/fetchers"
import { getCurrentUser } from "@/lib/session"
import { actionType } from "@/lib/types"

export const metadata: Metadata = {
  title: "Operadores"
}

export default async function Page() {
  const user = await getCurrentUser()

  if (!user?.organizationId) {
    notFound()
  }

  const operators = await getOperators(user?.organizationId)

  return (
    <div className="mx-auto grow px-4 sm:px-6">
      <PageSubtitle
        title="Operadores"
        description="Listado de operadores para el registro de viajes"
      >
        <OperatorEdit
          organizationId={user.organizationId}
          action={actionType.CREATE}
        />
      </PageSubtitle>
      <div className="mt-6">
        <DataTable columns={columns} data={operators} />
      </div>
    </div>
  )
}
