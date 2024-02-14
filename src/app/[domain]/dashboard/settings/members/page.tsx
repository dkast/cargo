import { columns } from "@/app/[domain]/dashboard/settings/members/columns"
import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table/data-table"
import { getMembers, getOrganizationBySubDomain } from "@/server/fetchers"

export const metadata: Metadata = {
  title: "Miembros"
}

export default async function MembersPage({
  params: { domain }
}: {
  params: { domain: string }
}) {
  const orgData = await getOrganizationBySubDomain(domain)

  if (!orgData) {
    notFound()
  }

  const data = await getMembers(orgData.id)

  return (
    <div className="mx-auto grow px-4 sm:px-6">
      <PageSubtitle
        title="Miembros"
        description="Administra a los miembros de la organización"
      >
        <Button asChild>
          <Link href="members/new">Nuevo miembro</Link>
        </Button>
      </PageSubtitle>
      <div className="mt-6">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}
