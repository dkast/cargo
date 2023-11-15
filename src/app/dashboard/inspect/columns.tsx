"use client"

import toast from "react-hot-toast"
import { InspectionResult, InspectionStatus, type Prisma } from "@prisma/client"
import { type ColumnDef, type Row } from "@tanstack/react-table"
import { format } from "date-fns"
import { MoreHorizontal } from "lucide-react"
import { useAction } from "next-safe-action/hook"
import Link from "next/link"

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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { deleteCTPATInspection } from "@/server/actions/ctpat"
import { type getInspections } from "@/server/fetchers"
import { cn } from "@/lib/utils"

// We use the type of the data returned by getInspections to define the type of the columns
type InspectionMaster = Prisma.PromiseReturnType<typeof getInspections>

// Use type[number] to get the type of the array elements
export const columns: ColumnDef<InspectionMaster[number]>[] = [
  {
    accessorKey: "inspectionNbr",
    header: "#Folio",
    cell: ({ row }) => {
      const inspection = row.original

      return <span>{inspection.inspectionNbr.toString().padStart(5, "0")}</span>
    }
  },
  {
    accessorKey: "inspectedBy.user.name",
    header: "Inspector"
  },
  {
    accessorKey: "company.name",
    header: "Transportista"
  },
  {
    accessorKey: "operator.name",
    header: "Operador"
  },
  {
    accessorKey: "start",
    header: "Fecha Inspección",
    cell: ({ row }) => {
      const inspection = row.original

      // Validate if inspectionStart is a date
      if (inspection.start instanceof Date) {
        return <span>{format(inspection.start, "Pp")}</span>
      } else {
        return <span>{format(new Date(inspection.start), "Pp")}</span>
      }
    }
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const inspection = row.original
      const color = {
        OPEN: "bg-amber-100 text-amber-500",
        CLOSED: "bg-blue-100 text-blue-500",
        APPROVED: "bg-green-100 text-green-500"
      }

      const legend = {
        OPEN: "En proceso",
        CLOSED: "Cerrado",
        APPROVED: "Aprobado"
      }

      return (
        <div className="flex flex-row items-center gap-2">
          <div
            className={cn(
              color[inspection.status],
              "flex-none rounded-full p-1"
            )}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-current" />
          </div>
          <div className="hidden sm:block">{legend[inspection.status]}</div>
        </div>
      )
    }
  },
  {
    accessorKey: "result",
    header: "Resultado",
    cell: ({ row }) => {
      const inspection = row.original
      return (
        <div>
          {(() => {
            switch (inspection.result) {
              case InspectionResult.PASS:
                return (
                  <Badge variant="green" className="rounded">
                    OK
                  </Badge>
                )
              case InspectionResult.FAIL:
                return (
                  <Badge variant="red" className="rounded">
                    Falla
                  </Badge>
                )
              default:
                return null
            }
          })()}
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: InspectionActions
  }
]

function InspectionActions({ row }: { row: Row<InspectionMaster[number]> }) {
  const inspection = row.original

  const { execute, reset } = useAction(deleteCTPATInspection, {
    onExecute() {
      toast.loading("Eliminando inspección...")
    },
    onSuccess() {
      toast.dismiss()
      reset()
    },
    onError() {
      toast.error("Algo salió mal")
      reset()
    }
  })

  const deleteInspection = () => {
    execute({
      id: inspection.id,
      organizationId: inspection.organizationId
    })
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/ctpat/${inspection.id}`}>Ver</Link>
          </DropdownMenuItem>
          {inspection.status === InspectionStatus.OPEN && (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/ctpat/edit/${inspection.id}`}>
                  Finalizar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem asChild>
                  <span className="text-red-500">Eliminar</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </>
          )}
          {inspection.status === InspectionStatus.CLOSED && (
            <DropdownMenuItem asChild>
              <span>Exportar PDF</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar inspección</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de eliminar la inspección? Esta acción no se puede
            deshacer
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => deleteInspection()}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
