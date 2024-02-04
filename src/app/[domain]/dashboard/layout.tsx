"use client"

import Sidebar from "@/app/[domain]/dashboard/sidebar"
import { useAtom } from "jotai"

import { cn, isSidebarOpenAtom } from "@/lib/utils"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen] = useAtom(isSidebarOpenAtom)
  return (
    <>
      <Sidebar />
      <div
        className={cn(
          isSidebarOpen ? "lg:pl-60" : "lg:pl-20",
          "flex min-h-screen flex-col transition-all duration-300 ease-in-out"
        )}
      >
        {children}
      </div>
    </>
  )
}
