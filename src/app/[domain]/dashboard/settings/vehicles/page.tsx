import { columns } from "@/app/[domain]/dashboard/settings/vehicles/columns"
import VehicleEdit from "@/app/[domain]/dashboard/settings/vehicles/vehicle-edit"
import { Truck } from "lucide-react"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { DataTable } from "@/components/ui/data-table/data-table"
import { getVehicles } from "@/server/fetchers"
import { getOrganizationBySubDomain } from "@/server/fetchers/organization"
import { actionType } from "@/lib/types"

export const metadata: Metadata = {
  title: "Vehículos"
}

export default async function VehiclesPage({
  params: { domain }
}: {
  params: { domain: string }
}) {
  const orgData = await getOrganizationBySubDomain(domain)

  if (!orgData) {
    notFound()
  }

  const vehicles = await getVehicles(orgData.id)

  return (
    <div className="mx-auto grow px-4 sm:px-6">
      <PageSubtitle
        title="Unidades"
        description="Listado de vehículos para el registro de viajes"
        Icon={Truck}
      >
        <VehicleEdit organizationId={orgData.id} action={actionType.CREATE} />
      </PageSubtitle>
      <div className="mt-6">
        <DataTable columns={columns} data={vehicles} />
      </div>
    </div>
  )
}
