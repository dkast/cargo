import toast from "react-hot-toast"
import { type InspectionItemFile } from "@prisma/client"
import { Trash2 } from "lucide-react"
import { useAction } from "next-safe-action/hook"
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
import ImageViewer from "@/components/ui/image-viewer"
import { deleteFile } from "@/server/actions/file"
import { cn } from "@/lib/utils"

export default function ItemMediaPreview({
  fileList,
  allowDelete = false
}: {
  fileList: Partial<InspectionItemFile>[]
  allowDelete?: boolean
}) {
  const router = useRouter()
  const { execute } = useAction(deleteFile, {
    onExecute: () => {
      toast.loading("Eliminando archivo")
    },
    onSuccess: () => {
      toast.dismiss()
    },
    onError: () => {
      toast.error("No se pudo eliminar el archivo")
    }
  })

  const onDeleteFile = async (id: string | undefined) => {
    if (!id) return
    await execute({ id })
    router.refresh()
  }

  return (
    <ul className="flex flex-row items-center gap-x-2">
      {fileList.map(file => (
        <li
          key={file.id}
          className="flex flex-row items-center rounded-lg bg-gray-100"
        >
          {file.fileUrl && (
            <ImageViewer
              className={cn(allowDelete ? "w-16 rounded-r-none" : "")}
              src={file.fileUrl}
            />
          )}
          {allowDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  className="rounded-full text-gray-700"
                  variant="link"
                  size="icon"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex flex-row items-center gap-x-3">
                    <div className="rounded-full bg-red-100 p-2 text-red-500">
                      <Trash2 className="h-6 w-6" />
                    </div>
                    Eliminar archivo
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                  ¿Estás seguro que deseas eliminar este archivo?
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => onDeleteFile(file.id)}
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </li>
      ))}
    </ul>
  )
}
