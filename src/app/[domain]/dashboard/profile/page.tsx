import ProfileForm from "@/app/[domain]/dashboard/profile/profile-form"
import { notFound } from "next/navigation"
import { type z } from "zod"

import PageHeader from "@/components/dashboard/page-header"
import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getMemberById } from "@/server/fetchers"
import { getCurrentUser } from "@/lib/session"
import { type userMemberSchema } from "@/lib/types"
import { getInitials } from "@/lib/utils"

type UserMemberFormValues = z.infer<typeof userMemberSchema>

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) return notFound()

  const membership = await getMemberById(user.membershipId)

  const member: Partial<UserMemberFormValues> = {
    id: membership?.id,
    organizationId: membership?.organizationId,
    name: membership?.user.name,
    username: membership?.user.username,
    email: membership?.user.email ?? undefined,
    password: "password",
    confirmPassword: "password",
    role: membership?.role
  }

  return (
    <>
      <PageHeader title="Mi Perfil" />
      <div className="flex grow py-4">
        <div className="mx-auto max-w-2xl grow px-4 sm:px-0">
          <PageSubtitle
            title="Datos generales"
            description="Información general sobre mi cuenta"
          />
          <div className="relative my-6 rounded-xl bg-gradient-to-t from-white to-gray-100">
            <div className="bg-dot-pattern absolute inset-0 size-full" />
            <div className="absolute inset-0 size-full rounded-xl bg-gradient-to-t from-gray-50 via-gray-100/50 to-gray-200/90" />
            <div className="flex h-36 items-center overflow-hidden px-7">
              <Avatar className="size-20 shadow-lg">
                {user.image && <AvatarImage src={user.image} />}
                <AvatarFallback className="text-2xl">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="relative pb-8 pl-8 pr-8">
              <h3 className="text-xl font-semibold leading-none">
                {member.name}
              </h3>
              <p className="mt-1.5 font-medium leading-none text-gray-600">
                {member.email}
              </p>
            </div>
          </div>
          <ProfileForm member={member} />
        </div>
      </div>
    </>
  )
}
