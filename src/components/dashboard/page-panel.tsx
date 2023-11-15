"use client"

import { useRouter } from "next/navigation"

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle
} from "@/components/ui/drawer"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { useMobile } from "@/lib/use-mobile"
import { cn } from "@/lib/utils"

export default function Panel({
  title,
  description,
  children,
  className
}: {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  const router = useRouter()
  const isMobile = useMobile()
  return (
    <>
      {isMobile ? (
        <Drawer
          open={true}
          onOpenChange={open => (!open ? router.back() : null)}
        >
          <DrawerContent className={cn(className, "py-4")}>
            <div className="mx-auto mb-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300" />
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
            {children}
          </DrawerContent>
        </Drawer>
      ) : (
        <Sheet
          defaultOpen
          onOpenChange={open => (!open ? router.back() : null)}
          modal
        >
          <SheetContent
            className={className}
            // onPointerDownOutside={e => e.preventDefault()}
          >
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>{description}</SheetDescription>
            </SheetHeader>
            {children}
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}
