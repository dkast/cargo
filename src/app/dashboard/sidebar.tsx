"use client"

import { useState } from "react"
import ProfileMenu from "@/app/dashboard/profile-menu"
import { useAtom } from "jotai"
import {
  ClipboardCheck,
  FileBarChart,
  Home,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  type LucideIcon
} from "lucide-react"
import Link from "next/link"
import { usePathname, useSelectedLayoutSegment } from "next/navigation"

import { TooltipHelper } from "@/components/dashboard/tooltip-helper"
import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { cn, isSidebarOpenAtom } from "@/lib/utils"

type NavigationItem = {
  name: string
  href: string
  icon: LucideIcon
}

const navigation: NavigationItem[] = [
  { name: "Inicio", href: "/dashboard", icon: Home },
  { name: "Inspecciones", href: "/dashboard/inspect", icon: ClipboardCheck },
  { name: "Informes", href: "/dashboard/reports", icon: FileBarChart },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings }
]

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isSidebarOpen, toggle] = useAtom(isSidebarOpenAtom)

  return (
    <>
      {/* Sidebar for desktop */}
      <div
        className={cn(
          isSidebarOpen ? "lg:w-60" : "lg:w-20",
          "hidden transition-all duration-300 ease-in-out lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col"
        )}
      >
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-gray-50 px-6">
          <div
            className={cn(
              isSidebarOpen ? "justify-between" : "justify-center",
              "flex h-16 shrink-0 items-center"
            )}
          >
            {isSidebarOpen && <Logo className="fill-[#201923]" />}
            <TooltipHelper
              content={
                isSidebarOpen
                  ? "Ocultar barra lateral"
                  : "Mostrar barra lateral"
              }
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-500 hover:text-gray-800"
                onClick={() => toggle(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <PanelLeftOpen className="h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </TooltipHelper>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="-mx-2 space-y-2">
                  {navigation.map(item => (
                    <NavigationLink item={item} key={item.name} />
                  ))}
                </ul>
              </li>
              <li className="-mx-6 mt-auto">
                <ProfileMenu />
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Sidebar for mobile */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-50 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle>
                <Logo className="h-8 w-auto fill-[#201923]" />
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-4 flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul
                    role="presentation"
                    className="-mx-2 space-y-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    {navigation.map(item => (
                      <NavigationLink item={item} key={item.name} isMobile />
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          {/* Empty */}
        </div>
        <ProfileMenu isMobile />
      </div>
    </>
  )
}

function NavigationLink({
  item,
  isMobile
}: {
  item: NavigationItem
  isMobile?: boolean
}) {
  const pathname = usePathname()
  const segment = useSelectedLayoutSegment()
  const [isSidebarOpen] = useAtom(isSidebarOpenAtom)

  let isActive = false
  if (!segment || segment === "(overview)") {
    isActive = pathname === item.href
  } else {
    isActive = item.href.includes(segment)
  }

  return (
    <li key={item.name} className="flex flex-row items-center gap-1">
      <div
        className={cn(
          isActive ? "bg-orange-500" : "bg-transparent",
          "h-6 w-1 rounded-full"
        )}
        aria-hidden="true"
      />
      <Link
        href={item.href}
        className={cn(
          isActive
            ? "bg-gray-200/70  text-gray-700"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-600",
          "group flex grow gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
        )}
      >
        <item.icon
          className={cn(
            isActive
              ? "text-gray-800"
              : "text-gray-400 group-hover:text-gray-600",
            "h-6 w-6 shrink-0"
          )}
          aria-hidden="true"
        />
        {(isSidebarOpen || isMobile) && (
          <span className="animate-in animate-out fade-in fade-out">
            {item.name}
          </span>
        )}
      </Link>
    </li>
  )
}
