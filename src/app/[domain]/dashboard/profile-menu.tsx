"use client"

import { useAtom } from "jotai"
import { ChevronsUpDown, LogOut, SunMoon, User } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useParams } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn, getInitials, isSidebarOpenAtom } from "@/lib/utils"

export default function ProfileMenu({ isMobile }: { isMobile?: boolean }) {
  const { data: session } = useSession()
  const user = session?.user
  const [isSidebarOpen] = useAtom(isSidebarOpenAtom)
  const params = useParams<{ domain: string }>()
  const { theme, setTheme } = useTheme()

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            isMobile
              ? "focus:outline-none"
              : "flex w-full items-center justify-center gap-x-4 border-t px-3 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-white focus:outline-none"
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
              <ChevronsUpDown className="size-4 text-gray-500" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${params.domain}/dashboard/profile`}>
            <User className="mr-2 size-4" />
            Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <SunMoon className="mr-2 size-4" />
            <span>Tema</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuRadioItem value="system">
                  Sistema
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="light">
                  Claro
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  Oscuro
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOut()}>
          <LogOut className="mr-2 size-4" />
          <span>Salir</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
