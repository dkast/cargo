import { notFound } from "next/navigation"

import PageHeader from "@/components/dashboard/page-header"
import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCurrentUser } from "@/lib/session"
import { getInitials } from "@/lib/utils"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) return notFound()

  return (
    <>
      <PageHeader title="Mi Perfil" />
      <div className="flex grow py-4">
        <div className="mx-auto max-w-2xl grow px-4 sm:px-0">
          <PageSubtitle
            title="Datos generales"
            description="Información general sobre mi cuenta"
          />
          <div className="mt-6 rounded-xl bg-gradient-to-t from-gray-50/50 to-gray-100">
            <div className="flex h-36 items-center overflow-hidden px-7">
              <Avatar className="size-20 shadow-lg">
                {user.image && <AvatarImage src={user.image} />}
                <AvatarFallback className="text-2xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="pb-8 pl-8 pr-8">
              <h3 className="text-xl font-semibold leading-none">
                {user.name}
              </h3>
              <p className="mt-1.5 font-medium leading-none text-gray-600">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
