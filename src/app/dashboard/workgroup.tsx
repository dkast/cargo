"use client"

import { useSession } from "next-auth/react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { getInitials } from "@/lib/utils"

export default function Workgroup() {
  const { data: session } = useSession()
  const user = session?.user

  if (!user) return <Skeleton className="h-6 w-24 bg-gray-200" />

  return (
    <div className="flex flex-row items-center gap-2">
      <Avatar className="rounded-lg shadow-sm">
        {/* {user.image && <AvatarImage src={user.image} />} */}
        <AvatarFallback>{getInitials(user.organizationName)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start">
        <span className="line-clamp-1 text-sm font-semibold">
          {user.organizationName}
        </span>
        <span className="text-xs font-semibold text-gray-500">Empresa</span>
      </div>
    </div>
  )
}
