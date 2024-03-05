"use client"

import Link from "next/link"
import {
  useParams,
  usePathname,
  useSelectedLayoutSegment
} from "next/navigation"

import { cn } from "@/lib/utils"

interface SecondarySidebarProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    title: string
    children: {
      title: string
      href: string
    }[]
  }[]
}

export default function SecondarySidebar({
  className,
  items,
  ...props
}: SecondarySidebarProps) {
  const pathname = usePathname()
  const segment = useSelectedLayoutSegment()
  const params = useParams<{ domain: string }>()

  return (
    <div className="hidden w-64 border-r border-gray-200 dark:border-gray-800 sm:block">
      <nav className={cn("flex", className)} {...props}>
        <ul className="flex min-w-full flex-none flex-col gap-y-4 p-4">
          {items.map(item => {
            return (
              <li key={item.title} className="w-full">
                <div className="mb-2 ml-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {item.title}
                </div>
                <ul className="flex flex-col gap-y-1">
                  {item.children.map(child => {
                    const path = `/${params.domain}${child.href}`
                    let isActive = false
                    if (!segment) {
                      isActive = pathname.includes(child.href)
                    } else {
                      isActive = child.href.includes(segment)
                    }

                    return (
                      <li key={child.href}>
                        <Link
                          href={path}
                          className={cn(
                            "block rounded-lg p-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                            isActive && "bg-gray-100 text-gray-900"
                          )}
                        >
                          {child.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
