"use client"

import toast from "react-hot-toast"
import { Trash2 } from "lucide-react"
import { useAction } from "next-safe-action/hooks"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteWaitlist } from "@/server/actions/general"

export default function WaitlistDelete({ id }: { id: string }) {
  const { execute, reset } = useAction(deleteWaitlist, {
    onExecute: () => {
      toast.loading("Eliminando entrada...")
    },
    onSuccess: ({ data }) => {
      if (data?.failure?.reason) {
        toast.dismiss()
        toast.error(data.failure.reason)
      } else if (data?.success) {
        toast.dismiss()
      }
      reset()
    },
    onError: () => {
      toast.error("Algo salió mal")
    }
  })

  const onDeleteEntry = () => {
    execute({ id })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="ghost" size="icon">
          <Trash2 className="size-4 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar entrada</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          ¿Estás seguro de que deseas eliminar esta entrada?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onDeleteEntry} variant="destructive">
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
