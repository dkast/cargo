"use client"

import { type Prisma } from "@prisma/client"
import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
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
    accessorKey: "inspectionStart",
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
    accessorKey: "inspectionStatus",
    header: "Estado",
    cell: ({ row }) => {
      const inspection = row.original
      const color = {
        OPEN: "bg-amber-100 text-amber-500",
        CLOSED: "bg-gray-100 text-gray-500",
        APPROVED: "bg-green-100 text-green-500"
      }

      const legend = {
        OPEN: "Pendiente",
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
    id: "actions",
    cell: ({ row }) => {
      const inspection = row.original

      return (
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
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/ctpat/${inspection.id}/edit`}>
                Editar
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
