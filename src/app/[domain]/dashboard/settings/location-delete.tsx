"use client"

import toast from "react-hot-toast"
import { type Prisma } from "@prisma/client"
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
import { deleteLocation } from "@/server/actions/location"
import { type getLocations } from "@/server/fetchers"

export default function LocationActionMenu({
  data
}: {
  data: Prisma.PromiseReturnType<typeof getLocations>[number]
}) {
  const { execute, reset } = useAction(deleteLocation, {
    onExecute: () => {
      toast.loading("Eliminando ubicación...")
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
      reset()
    }
  })

  const onDeleteLocation = () => {
    execute({
      id: data.id,
      organizationId: data.organizationId
    })
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
          <AlertDialogTitle>Eliminar ubicación</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de eliminar la ubicación? Esta acción no se puede
            deshacer
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => onDeleteLocation()}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
