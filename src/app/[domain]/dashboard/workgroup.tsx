"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn, getInitials } from "@/lib/utils"

export default function Workgroup({ className }: { className?: string }) {
  const params = useParams<{ domain: string }>()
  const [imageURL, setImageURL] = useState("")
  const [name, setName] = useState(undefined)

  useEffect(() => {
    if (!params.domain) return
    fetch(`/api/file/brand-image?subdomain=${params.domain}`)
      .then(res => res.json())
      .then(data => {
        setImageURL(data.imageURL)
        setName(data.organizationName)
      })
  }, [params.domain])

  if (!name)
    return (
      <div className="flex flex-row items-center gap-2">
        <Skeleton className="size-10 bg-gray-200" />
        <Skeleton className="h-6 w-24 bg-gray-200" />
      </div>
    )

  return (
    <div className={cn("flex flex-row items-center gap-2", className)}>
      <Avatar className="rounded-xl shadow">
        <AvatarImage src={imageURL} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start">
        <span className="line-clamp-1 text-sm font-semibold">{name}</span>
        <span className="text-xs font-semibold text-gray-500">Empresa</span>
      </div>
    </div>
  )
}
