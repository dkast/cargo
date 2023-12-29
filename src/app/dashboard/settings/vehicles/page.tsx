import { columns } from "@/app/dashboard/settings/vehicles/columns"
import VehicleEdit from "@/app/dashboard/settings/vehicles/vehicle-edit"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { DataTable } from "@/components/ui/data-table/data-table"
import { getVehicles } from "@/server/fetchers"
import { getCurrentUser } from "@/lib/session"
import { actionType } from "@/lib/types"

export const metadata: Metadata = {
  title: "Vehículos"
}

export default async function Page() {
  const user = await getCurrentUser()

  if (!user?.organizationId) {
    notFound()
  }

  const vehicles = await getVehicles(user?.organizationId)

  return (
    <div className="mx-auto grow px-4 sm:px-6">
      <PageSubtitle
        title="Unidades"
        description="Listado de vehículos para el registro de viajes"
      >
        <VehicleEdit
          organizationId={user.organizationId}
          action={actionType.CREATE}
        />
      </PageSubtitle>
      <div className="mt-6">
        <DataTable columns={columns} data={vehicles} />
      </div>
    </div>
  )
}
