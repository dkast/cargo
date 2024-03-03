"use client"

import { useState } from "react"
import ProfileMenu from "@/app/[domain]/dashboard/profile-menu"
import Workgroup from "@/app/[domain]/dashboard/workgroup"
import { motion } from "framer-motion"
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
import {
  useParams,
  usePathname,
  useSelectedLayoutSegment
} from "next/navigation"

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
  { name: "Inicio", href: "dashboard", icon: Home },
  {
    name: "Inspecciones",
    href: "dashboard/inspect",
    icon: ClipboardCheck
  },
  { name: "Informes", href: "dashboard/reports", icon: FileBarChart },
  {
    name: "Configuración",
    href: "dashboard/settings",
    icon: Settings
  }
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
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-gray-50 px-6 dark:border-gray-800 dark:bg-gray-950">
          <div
            className={cn(
              isSidebarOpen ? "justify-between" : "justify-center",
              "flex h-16 shrink-0 items-center"
            )}
          >
            <Workgroup className={cn(isSidebarOpen ? "visible" : "hidden")} />
            <TooltipHelper
              content={isSidebarOpen ? "Colapsar menú" : "Mostrar menú"}
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
                {/* <Workgroup /> */}
                <Logo />
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
  const params = useParams<{ domain: string }>()
  const [isSidebarOpen] = useAtom(isSidebarOpenAtom)

  let isActive = false
  if (!segment || segment === "(overview)") {
    isActive = pathname.includes(item.href)
  } else {
    isActive = item.href.includes(segment)
  }

  const path = `/${params.domain}/${item.href}`

  return (
    <motion.li
      key={item.name}
      className="flex flex-row items-center gap-1"
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={cn(
          isActive ? "bg-orange-500" : "bg-transparent",
          "h-6 w-1 rounded-full"
        )}
        aria-hidden="true"
      />
      <Link
        href={path}
        className={cn(
          isActive
            ? "bg-gray-200/70 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-600",
          "group flex grow gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
        )}
      >
        <item.icon
          className={cn(
            isActive
              ? "text-gray-800 dark:text-gray-300"
              : "text-gray-400 group-hover:text-gray-600 dark:text-gray-700",
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
    </motion.li>
  )
}
