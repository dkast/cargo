import { columns } from "@/app/[domain]/dashboard/settings/operators/columns"
import OperatorEdit from "@/app/[domain]/dashboard/settings/operators/operator-edit"
import { SquareUserRound } from "lucide-react"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { DataTable } from "@/components/ui/data-table/data-table"
import { getOperators } from "@/server/fetchers"
import { getOrganizationBySubDomain } from "@/server/fetchers/organization"
import { actionType } from "@/lib/types"

export const metadata: Metadata = {
  title: "Operadores"
}

export default async function OperatorsPage({
  params: { domain }
}: {
  params: { domain: string }
}) {
  const orgData = await getOrganizationBySubDomain(domain)

  if (!orgData) {
    notFound()
  }

  const operators = await getOperators(orgData.id)

  return (
    <div className="mx-auto grow px-4 sm:px-6">
      <PageSubtitle
        title="Operadores"
        description="Listado de operadores para el registro de viajes"
        Icon={SquareUserRound}
      >
        <OperatorEdit organizationId={orgData.id} action={actionType.CREATE} />
      </PageSubtitle>
      <div className="mt-6">
        <DataTable columns={columns} data={operators} />
      </div>
    </div>
  )
}
