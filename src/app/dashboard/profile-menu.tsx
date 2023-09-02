"use client"

import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"

export default function ProfileMenu({ isMobile }: { isMobile?: boolean }) {
  const { data: session } = useSession()
  return (
    <a
      href="#"
      className={cn(
        isMobile
          ? ""
          : "flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-zinc-100"
      )}
    >
      <img
        className="h-8 w-8 rounded-full bg-gray-50"
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt=""
      />
      <span className="sr-only">Tu Perfil</span>
      {!isMobile && <span aria-hidden="true">{session?.user.name}</span>}
    </a>
  )
}
