import { columns } from "@/app/dashboard/settings/members/columns"
import { DataTable } from "@/app/dashboard/settings/members/data-table"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Button } from "@/components/ui/button"
import { prisma } from "@/server/db"
import { getCurrentUser } from "@/lib/session"

export default async function MembersPage() {
  const user = await getCurrentUser()

  const data = await prisma.membership.findMany({
    where: {
      organizationId: user?.organizationId
    },
    include: {
      user: true
    }
  })

  return (
    <div className="mx-auto grow px-3 sm:px-6">
      <PageSubtitle
        title="Miembros"
        description="Administre a los miembros de la empresa"
      >
        <Button variant="secondary">Agregar miembro</Button>
      </PageSubtitle>
      <div className="mt-6">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}
