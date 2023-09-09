import MemberForm from "@/app/dashboard/settings/members/[id]/member-form"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { getCurrentUser } from "@/lib/session"
import { actionType } from "@/lib/types"

export default async function MemberPage({
  params
}: {
  params: { id: string }
}) {
  const { id } = params
  const action = id === "new" ? actionType.CREATE : actionType.UPDATE
  const actionMessage = id === "new" ? "Crear" : "Editar"

  const user = await getCurrentUser()

  if (!user?.organizationId) {
    return <div>Not found</div>
  }

  return (
    <div className="mx-auto max-w-2xl grow px-3 sm:px-0">
      <PageSubtitle
        title={`${actionMessage} miembro`}
        description="Capture la información general"
      />
      <MemberForm organizationId={user?.organizationId} action={action} />
    </div>
  )
}
