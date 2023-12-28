"use client"

import ContainerDelete from "@/app/dashboard/settings/containers/container-delete"
import ContainerEdit from "@/app/dashboard/settings/containers/container-edit"
import { type ColumnDef } from "@tanstack/react-table"
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react"
import { type z } from "zod"

import { Button } from "@/components/ui/button"
import { actionType, type containerSchema } from "@/lib/types"

export const columns: ColumnDef<z.infer<typeof containerSchema>>[] = [
  {
    accessorKey: "containerNbr",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Unidad
          {{
            asc: <ChevronUp className="ml-2 h-4 w-4" />,
            desc: <ChevronDown className="ml-2 h-4 w-4" />
          }[column.getIsSorted() as string] ?? (
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const container = row.original
      return (
        <div key={container.id} className="flex justify-end gap-x-2">
          <ContainerEdit
            organizationId={container.organizationId}
            container={container}
            action={actionType.UPDATE}
          />
          <ContainerDelete data={container} />
        </div>
      )
    }
  }
]
