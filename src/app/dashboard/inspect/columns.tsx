"use client"

import { type Prisma } from "@prisma/client"
import { type ColumnDef } from "@tanstack/react-table"
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

// We use the type of the data returned by getInspections to define the type of the columns
type InspectionMaster = Prisma.PromiseReturnType<typeof getInspections>

// Use type[number] to get the type of the array elements
export const columns: ColumnDef<InspectionMaster[number]>[] = [
  {
    accessorKey: "id",
    header: "ID"
  },
  {
    accessorKey: "company.name",
    header: "Transportista"
  },
  {
    accessorKey: "inspectionStart",
    header: "Fecha"
  },
  {
    accessorKey: "inspectionStatus",
    header: "Estado"
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
