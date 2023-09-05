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
      <nav
        className={cn("flex flex-row items-center px-4", className)}
        {...props}
      >
        {items.map((item, i) => (
          <Link
            href={item.href}
            key={i}
            className={cn(
              "block rounded-lg px-4 py-2 text-sm font-semibold text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
              pathname === item.href && "text-violet-600"
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
      <Separator className="my-4" />
    </>
  )
}
