"use client"

import toast from "react-hot-toast"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { deleteOrganization } from "@/server/actions/organization"

function OrganizationDelete({ organizationId }: { organizationId: string }) {
  const router = useRouter()

  const { execute, reset } = useAction(deleteOrganization, {
    onExecute: () => {
      toast.loading("Eliminando organización")
    },
    onSuccess: () => {
      toast.dismiss()
      router.push("/login")
      reset()
    },
    onError: () => {
      toast.error("No se pudo eliminar la organización")
      reset()
    }
  })

  const handleDelete = () => {
    execute({
      id: organizationId
    })
  }

  return (
    <>
      <Separator className="my-8" />
      <AlertDialog>
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="text-base text-red-500">
              Eliminar Organización
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-start justify-center gap-x-8 gap-y-4 sm:flex-row sm:items-center">
            <p className="text-gray-500">
              Eliminar la organización, catalogos e inspecciones asociadas a la
              misma. Esta operación es irreversible.
            </p>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Eliminar Organización</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar Organización</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Estás seguro que deseas eliminar la organización? Esta acción
                  es irreversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => {
                    handleDelete()
                  }}
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </CardContent>
        </Card>
      </AlertDialog>
    </>
  )
}
export default OrganizationDelete
