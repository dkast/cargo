"use client"

import { useRouter } from "next/navigation"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

export default function Modal({
  title,
  description,
  children
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  const router = useRouter()
  return (
    <Dialog defaultOpen onOpenChange={open => (!open ? router.back() : null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  )
}
