import MemberForm from "@/app/dashboard/settings/members/[id]/member-form"
import { MembershipRole } from "@prisma/client"
import { AlertCircle, ShieldAlert } from "lucide-react"
import { type Metadata } from "next"
import { type z } from "zod"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { prisma } from "@/server/db"
import { getCurrentUser } from "@/lib/session"
import { actionType, type userMemberSchema } from "@/lib/types"

export const metadata: Metadata = {
  title: "Editar miembro"
}

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
    return (
      <div className="mx-auto max-w-2xl grow px-4 sm:px-0">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ocurrió un error</AlertTitle>
          <AlertDescription>
            El usuario no pertenece a una organización
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (
    user?.role !== MembershipRole.ADMIN &&
    user?.role !== MembershipRole.OWNER
  ) {
    return (
      <div className="mx-auto max-w-2xl grow px-4 sm:px-0">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Permiso denegado</AlertTitle>
          <AlertDescription>
            No tiene permisos para acceder a esta página
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  type UserMemberFormValues = z.infer<typeof userMemberSchema>
  let member: Partial<UserMemberFormValues> = {}

  if (id !== "new") {
    const membership = await prisma.membership.findUnique({
      where: { id },
      include: { user: true }
    })

    if (
      membership?.role === MembershipRole.ADMIN &&
      user?.role !== MembershipRole.ADMIN
    ) {
      return (
        <div className="mx-auto max-w-2xl grow px-4 sm:px-0">
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Permiso denegado</AlertTitle>
            <AlertDescription>
              No tiene permisos para modificar Administrador
            </AlertDescription>
          </Alert>
        </div>
      )
    }

    member = {
      id: membership?.id,
      organizationId: membership?.organizationId,
      name: membership?.user.name,
      username: membership?.user.username,
      email: membership?.user.email ?? undefined,
      password: "password",
      confirmPassword: "password",
      role: membership?.role
    }
  } else {
    //default values
    member = {
      id: "",
      organizationId: user?.organizationId,
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "MEMBER"
    }
  }

  return (
    <div className="mx-auto max-w-2xl grow px-4 sm:px-0">
      <PageSubtitle
        title={`${actionMessage} miembro`}
        description="Capture la información general"
      />
      <MemberForm action={action} member={member} />
    </div>
  )
}
