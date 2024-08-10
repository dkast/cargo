"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { getOrganizationBySubDomain } from "@/server/fetchers"
import { cn, getInitials } from "@/lib/utils"

export default function Workgroup({ className }: { className?: string }) {
  const params = useParams<{ domain: string }>()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["organization", params.domain],
    queryFn: () => getOrganizationBySubDomain(params.domain)
  })

  if (isLoading)
    return (
      <div className="flex flex-row items-center gap-2">
        <Skeleton className="size-10 bg-gray-200" />
        <Skeleton className="h-6 w-24 bg-gray-200" />
      </div>
    )

  if (isError) return <div>Error</div>

  return (
    <div className={cn("flex flex-row items-center gap-2", className)}>
      <Avatar className="rounded-xl shadow">
        <AvatarImage src={data?.image ?? undefined} />
        <AvatarFallback>{getInitials(data?.name)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start">
        <span className="line-clamp-1 text-sm font-semibold">{data?.name}</span>
        <span className="text-xs font-semibold text-gray-500">
          Organización
        </span>
      </div>
    </div>
  )
}
