"use client"

import toast from "react-hot-toast"
import { InspectionResult, InspectionStatus, type Prisma } from "@prisma/client"
import { type ColumnDef, type Row } from "@tanstack/react-table"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  CheckCircle2,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  CircleDashed,
  CircleDot,
  MoreHorizontal
} from "lucide-react"
import { useAction } from "next-safe-action/hooks"
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          # Folio
          {{
            asc: <ChevronUp className="ml-1 h-4 w-4" />,
            desc: <ChevronDown className="ml-1 h-4 w-4" />
          }[column.getIsSorted() as string] ?? (
            <ChevronsUpDown className="ml-1 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => {
      const inspection = row.original

      return (
        <div>
          <span>{inspection.inspectionNbr.toString().padStart(5, "0")}</span>
          <dl className="font-normal lg:hidden">
            <dt className="sr-only">Transportista</dt>
            <dd className="mt-1 truncate text-gray-700">
              {inspection.company.name}
            </dd>
            <dt className="sr-only sm:hidden">Unidad</dt>
            <dd className="mt-1 truncate text-gray-500 sm:hidden">
              {inspection.vehicle.vehicleNbr}
            </dd>
            <dt className="sr-only sm:hidden">Fecha</dt>
            <dd className="mt-1 truncate text-gray-500 sm:hidden">
              {inspection.start instanceof Date ? (
                <span>{format(inspection.start, "dd/LL/yy HH:mm")}</span>
              ) : (
                <span>
                  {format(new Date(inspection.start), "dd/LL/YY HH:mm")}
                </span>
              )}
            </dd>
          </dl>
        </div>
      )
    }
  },
  {
    accessorKey: "inspectedBy.user.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Inspector
          {{
            asc: <ChevronUp className="ml-1 h-4 w-4" />,
            desc: <ChevronDown className="ml-1 h-4 w-4" />
          }[column.getIsSorted() as string] ?? (
            <ChevronsUpDown className="ml-1 h-4 w-4" />
          )}
        </Button>
      )
    },
    enableHiding: true
  },
  {
    accessorKey: "location.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ubicación
          {{
            asc: <ChevronUp className="ml-1 h-4 w-4" />,
            desc: <ChevronDown className="ml-1 h-4 w-4" />
          }[column.getIsSorted() as string] ?? (
            <ChevronsUpDown className="ml-1 h-4 w-4" />
          )}
        </Button>
      )
    },
    enableHiding: true
  },
  {
    accessorKey: "company.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Transportista
          {{
            asc: <ChevronUp className="ml-1 h-4 w-4" />,
            desc: <ChevronDown className="ml-1 h-4 w-4" />
          }[column.getIsSorted() as string] ?? (
            <ChevronsUpDown className="ml-1 h-4 w-4" />
          )}
        </Button>
      )
    },
    enableHiding: true
  },
  {
    accessorKey: "vehicle.vehicleNbr",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Unidad
          {{
            asc: <ChevronUp className="ml-1 h-4 w-4" />,
            desc: <ChevronDown className="ml-1 h-4 w-4" />
          }[column.getIsSorted() as string] ?? (
            <ChevronsUpDown className="ml-1 h-4 w-4" />
          )}
        </Button>
      )
    },
    enableHiding: true
  },
  {
    accessorKey: "operator.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Operador
          {{
            asc: <ChevronUp className="ml-1 h-4 w-4" />,
            desc: <ChevronDown className="ml-1 h-4 w-4" />
          }[column.getIsSorted() as string] ?? (
            <ChevronsUpDown className="ml-1 h-4 w-4" />
          )}
        </Button>
      )
    },
    enableHiding: true
  },
  {
    accessorKey: "start",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha Inspección
          {{
            asc: <ChevronUp className="ml-1 h-4 w-4" />,
            desc: <ChevronDown className="ml-1 h-4 w-4" />
          }[column.getIsSorted() as string] ?? (
            <ChevronsUpDown className="ml-1 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => {
      const inspection = row.original

      // Validate if inspectionStart is a date
      if (inspection.start instanceof Date) {
        return <span>{format(inspection.start, "Pp", { locale: es })}</span>
      } else {
        return (
          <span>
            {format(new Date(inspection.start), "Pp", { locale: es })}
          </span>
        )
      }
    },
    enableHiding: true
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Estatus
          {{
            asc: <ChevronUp className="ml-1 h-4 w-4" />,
            desc: <ChevronDown className="ml-1 h-4 w-4" />
          }[column.getIsSorted() as string] ?? (
            <ChevronsUpDown className="ml-1 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => {
      const inspection = row.original
      const color = {
        OPEN: "bg-amber-100 text-amber-500",
        CLOSED: "bg-blue-100 text-blue-500",
        APPROVED: "bg-violet-100 text-violet-500"
      }

      const legend = {
        OPEN: "En proceso",
        CLOSED: "Cerrado",
        APPROVED: "Aprobado"
      }

      const icon = {
        OPEN: <CircleDashed className="size-4" />,
        CLOSED: <CircleDot className="size-4" />,
        APPROVED: <CheckCircle2 className="size-4" />
      }

      return (
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-row items-center justify-center gap-2 sm:justify-start">
            <div
              className={cn(
                color[inspection.status],
                "flex-none rounded-full p-0.5"
              )}
            >
              {/* <div className="h-1.5 w-1.5 rounded-full bg-current" /> */}
              {icon[inspection.status]}
            </div>
            <span className="hidden sm:block">{legend[inspection.status]}</span>
          </div>
          <div className="text-center">
            {(() => {
              switch (inspection.result) {
                case InspectionResult.PASS:
                  return (
                    <Badge variant="green" className="rounded md:hidden">
                      OK
                    </Badge>
                  )
                case InspectionResult.FAIL:
                  return (
                    <Badge variant="red" className="rounded md:hidden">
                      Falla
                    </Badge>
                  )
                default:
                  return null
              }
            })()}
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "result",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hidden px-0 sm:inline-flex"
        >
          Resultado
          {{
            asc: <ChevronUp className="ml-1 h-4 w-4" />,
            desc: <ChevronDown className="ml-1 h-4 w-4" />
          }[column.getIsSorted() as string] ?? (
            <ChevronsUpDown className="ml-1 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => {
      const inspection = row.original
      return (
        <div className="text-center">
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
    },
    enableHiding: true
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

  const onDeleteInspection = () => {
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
            <Link href={`ctpat/${inspection.id}`} prefetch={false}>
              Ver
            </Link>
          </DropdownMenuItem>
          {inspection.status === InspectionStatus.OPEN && (
            <>
              <DropdownMenuItem asChild>
                <Link href={`ctpat/edit/${inspection.id}`} prefetch={false}>
                  Continuar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialogTrigger
                asChild
                onClick={event => event.stopPropagation()}
              >
                <DropdownMenuItem asChild>
                  <span className="text-red-500">Eliminar</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </>
          )}
          {(inspection.status === InspectionStatus.CLOSED ||
            inspection.status === InspectionStatus.APPROVED) && (
            <DropdownMenuItem asChild>
              <Link
                href={`/ctpat/${inspection.id}/pdf`}
                prefetch={false}
                target="_blank"
              >
                Exportar PDF
              </Link>
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
          <AlertDialogCancel onClick={event => event.stopPropagation()}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={event => {
              event.stopPropagation()
              onDeleteInspection()
            }}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
