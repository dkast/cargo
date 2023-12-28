"use client"

import toast from "react-hot-toast"
import { Trash2 } from "lucide-react"
import { useAction } from "next-safe-action/hook"
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
import { deleteOperator } from "@/server/actions/operator"
import { type operatorSchema } from "@/lib/types"

export default function OperatorDelete({
  data
}: {
  data: z.infer<typeof operatorSchema>
}) {
  const { execute, reset } = useAction(deleteOperator, {
    onExecute: () => {
      toast.loading("Eliminando operador...")
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

  const onDeleteOperator = () => {
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
          <AlertDialogTitle>Eliminar operador</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de eliminar el operador? Esta acción no se puede
            deshacer
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => onDeleteOperator()}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
