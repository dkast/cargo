import OrganizationDataTable from "@/app/admin/organization-datatable"
import { MembershipRole } from "@prisma/client"
import { Building } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import type { Metadata } from "next/types"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Button } from "@/components/ui/button"
import { getOrganizations } from "@/server/fetchers/organization"
import { getCurrentUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Administración de organizaciones"
}

export default async function Page() {
  const user = await getCurrentUser()
  if (!user || user.role != MembershipRole.ADMIN) {
    redirect("/access-denied")
  }

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
