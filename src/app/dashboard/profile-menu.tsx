"use client"

import { LogOut, User } from "lucide-react"
import { signOut, useSession } from "next-auth/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn, getInitials } from "@/lib/utils"

export default function ProfileMenu({ isMobile }: { isMobile?: boolean }) {
  const { data: session } = useSession()
  const user = session?.user

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <a
          href="#"
          className={cn(
            isMobile
              ? "focus:outline-none"
              : "flex items-center focus:outline-none gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-white"
          )}
        >
          <Avatar>
            {user.image && <AvatarImage src={user.image} />}
            <AvatarFallback>{getInitials(user.name!)}</AvatarFallback>
          </Avatar>
          <span className="sr-only">Tu Perfil</span>
          {!isMobile && <span aria-hidden="true">{session?.user.name}</span>}
        </a>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
        <DropdownMenuItem>
          <User className="w-4 h-4 mr-2" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOut()}>
          <LogOut className="w-4 h-4 mr-2" />
          <span>Salir</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
