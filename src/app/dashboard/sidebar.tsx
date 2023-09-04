"use client"

import ProfileMenu from "@/app/dashboard/profile-menu"
import {
  FileBarChart,
  Home,
  Menu,
  Settings,
  Truck,
  type LucideIcon
} from "lucide-react"
import { usePathname } from "next/navigation"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type NavigationItem = {
  name: string
  href: string
  icon: LucideIcon
}

const navigation: NavigationItem[] = [
  { name: "Inicio", href: "/dashboard", icon: Home },
  { name: "Inspecciones", href: "/inspect", icon: Truck },
  { name: "Reportes", href: "/reports", icon: FileBarChart },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings }
]

export default function Sidebar() {
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-zinc-200 bg-zinc-50 px-6">
          <div className="flex h-16 shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=zinc&shade=600"
              alt="Your Company"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-2">
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
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-zinc-50 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <Sheet>
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
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=zinc&shade=600"
                  alt="Your Company"
                />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-1 flex-col mt-4">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-2">
                    {navigation.map(item => (
                      <NavigationLink item={item} key={item.name} />
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

function NavigationLink({ item }: { item: NavigationItem }) {
  const pathname = usePathname()
  console.log(pathname)
  const isActive = pathname === item.href
  return (
    <li key={item.name}>
      <a
        href={item.href}
        className={cn(
          isActive
            ? "bg-zinc-200/70  text-zinc-600"
            : "text-zinc-700 hover:text-zinc-600 hover:bg-zinc-100",
          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
        )}
      >
        <item.icon
          className={cn(
            isActive
              ? "text-zinc-600"
              : "text-zinc-400 group-hover:text-zinc-600",
            "h-6 w-6 shrink-0"
          )}
          aria-hidden="true"
        />
        {item.name}
      </a>
    </li>
  )
}
