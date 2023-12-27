"use client"

import TransportDelete from "@/app/dashboard/settings/transports/transport-delete"
import TransportEdit from "@/app/dashboard/settings/transports/transport-edit"
import { type ColumnDef } from "@tanstack/react-table"
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react"
import { type z } from "zod"

import { Button } from "@/components/ui/button"
import { actionType, type companySchema } from "@/lib/types"

export const columns: ColumnDef<z.infer<typeof companySchema>>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
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
      const company = row.original

      return (
        <div className="flex justify-end gap-x-2">
          <TransportEdit
            organizationId={company.organizationId}
            company={company}
            action={actionType.UPDATE}
          />
          <TransportDelete data={company} />
        </div>
      )
    }
  }
]
