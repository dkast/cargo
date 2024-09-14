import OrganizationAdminForm from "@/app/admin/organization/[id]/organization-admin-form"
import {
  MembershipRole,
  OrganizationPlan,
  OrganizationStatus
} from "@prisma/client"
import { Globe } from "lucide-react"
import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next/types"
import type { z } from "zod"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { getOrganizationById } from "@/server/fetchers/organization"
import { getCurrentUser } from "@/lib/session"
import { actionType, type orgSchema } from "@/lib/types"

export const metadata: Metadata = {
  title: "Editar Organización"
}

export default async function OrganizationPage({
  params: { id }
}: {
  params: { id: string }
}) {
  const user = await getCurrentUser()

  if (!user || user.role != MembershipRole.ADMIN) {
    redirect("/access-denied")
  }

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
      name: "Nueva organización",
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
        description={`${actionMessage} la organización`}
        Icon={Globe}
      />
      <OrganizationAdminForm data={data} action={action} enabled />
    </div>
  )
}
