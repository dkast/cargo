"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

export default function SecondaryNav({
  className,
  items,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <>
      <nav className={cn("flex overflow-x-auto py-3", className)} {...props}>
        <ul className="flex min-w-full flex-none gap-x-6 px-4">
          {items.map((item, i) => (
            <li key={i}>
              <Link
                href={item.href}
                className={cn(
                  "block rounded-lg px-4 py-2 text-sm font-semibold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
                  pathname === item.href && "text-violet-600"
                )}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Separator className="mb-4" />
    </>
  )
}
