"use client"

import { useAtom } from "jotai"
import { ChevronsUpDown, LogOut, User } from "lucide-react"
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
import { cn, getInitials, isSidebarOpenAtom } from "@/lib/utils"

export default function ProfileMenu({ isMobile }: { isMobile?: boolean }) {
  const { data: session } = useSession()
  const user = session?.user
  const [isSidebarOpen] = useAtom(isSidebarOpenAtom)

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <a
          href="#"
          className={cn(
            isMobile
              ? "focus:outline-none"
              : "flex items-center justify-center gap-x-4 border-t px-3 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-white focus:outline-none"
          )}
        >
          <Avatar>
            {user.image && <AvatarImage src={user.image} />}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <span className="sr-only">Tu Perfil</span>
          {!isMobile && isSidebarOpen && (
            <>
              <span aria-hidden="true">{session?.user.name}</span>
              <ChevronsUpDown className="h-4 w-4 text-gray-500" />
            </>
          )}
        </a>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Salir</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
