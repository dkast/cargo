import OrganizationAdminForm from "@/app/admin/organization/organization-admin-form"
import { OrganizationPlan, OrganizationStatus } from "@prisma/client"
import { Building } from "lucide-react"
import { notFound } from "next/navigation"
import type { Metadata } from "next/types"
import type { z } from "zod"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { getOrganizationById } from "@/server/fetchers/organization"
import { actionType, type orgSchema } from "@/lib/types"

export const metadata: Metadata = {
  title: "Editar Organización"
}

export default async function OrganizationPage({
  params: { id }
}: {
  params: { id: string }
}) {
  const action = id === "new" ? actionType.CREATE : actionType.UPDATE
  const actionMessage = id === "new" ? "Crear" : "Editar"

  let data: z.infer<typeof orgSchema> | null

  if (id !== "new") {
    const orgData = await getOrganizationById(id)
    if (!orgData) {
      notFound()
    }

    data = {
      id: orgData.id,
      name: orgData?.name,
      description: orgData?.description ?? "",
      subdomain: orgData?.subdomain,
      status: orgData?.status,
      plan: orgData?.plan
    }
  } else {
    data = {
      id: "",
      name: "",
      description: "",
      subdomain: "",
      status: OrganizationStatus.ACTIVE,
      plan: OrganizationPlan.TRIAL
    }
  }

  return (
    <div className="mx-auto max-w-2xl grow px-4 sm:px-0">
      <PageSubtitle
        title="Organización"
        description={`Editar ${actionMessage} organización`}
        Icon={Building}
      />
      <OrganizationAdminForm data={data} enabled />
    </div>
  )
}
