"use client"

import toast from "react-hot-toast"
import { Trash2 } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { type z } from "zod"

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
import { deleteContainer } from "@/server/actions/container"
import { type containerSchema } from "@/lib/types"

export default function ContainerDelete({
  data
}: {
  data: z.infer<typeof containerSchema>
}) {
  const { execute, reset } = useAction(deleteContainer, {
    onExecute: () => {
      toast.loading("Eliminando Contenedor...")
    },
    onSuccess: data => {
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
      reset()
    }
  })

  const onDeleteContainer = () => {
    execute(data)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar contenedor</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de eliminar el contenedor? Esta acción no se puede
            deshacer
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => onDeleteContainer()}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
