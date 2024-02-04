"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn, getInitials } from "@/lib/utils"

export default function Workgroup({ className }: { className?: string }) {
  const { data: session } = useSession()
  const user = session?.user
  const [imageURL, setImageURL] = useState("")

  useEffect(() => {
    if (!user?.organizationId) return
    fetch(`/api/file/brand-image?orgId=${user?.organizationId}`)
      .then(res => res.json())
      .then(data => setImageURL(data.signedUrl))
  }, [user])

  if (!user) return <Skeleton className="h-6 w-24 bg-gray-200" />

  return (
    <div className={cn("flex flex-row items-center gap-2", className)}>
      <Avatar className="rounded-xl shadow">
        <AvatarImage src={imageURL} />
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
