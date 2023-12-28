"use client"

import VehicleDelete from "@/app/dashboard/settings/vehicles/vehicle-delete"
import VehicleEdit from "@/app/dashboard/settings/vehicles/vehicle-edit"
import { type ColumnDef } from "@tanstack/react-table"
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react"
import { type z } from "zod"

import { Button } from "@/components/ui/button"
import { actionType, type vehicleSchema } from "@/lib/types"

export const columns: ColumnDef<z.infer<typeof vehicleSchema>>[] = [
  {
    accessorKey: "vehicleNbr",
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
    accessorKey: "licensePlate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Número de placas
          {{
            asc: <ChevronUp className="ml-2 h-4 w-4" />,
            desc: <ChevronDown className="ml-2 h-4 w-4" />
          }[column.getIsSorted() as string] ?? (
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    enableHiding: true
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const vehicle = row.original

      return (
        <div className="flex justify-end gap-x-2">
          <VehicleEdit
            organizationId={vehicle.organizationId}
            vehicle={vehicle}
            action={actionType.UPDATE}
          />
          <VehicleDelete data={vehicle} />
        </div>
      )
    }
  }
]
