import { type Prisma } from "@prisma/client"
import { type ColumnDef } from "@tanstack/react-table"

import { type getInspectionIssues } from "@/server/fetchers"

type InspectionIssue = Prisma.PromiseReturnType<typeof getInspectionIssues>

export const columns: ColumnDef<InspectionIssue[number]>[] = [
  {
    accessorKey: "inspectionNbr",
    header: "# Folio",
    cell: ({ row }) => {
      const item = row.original

      return item.inspection.inspectionNbr.toString().padStart(5, "0")
    }
  },
  {
    accessorKey: "question",
    header: "Tipo Falla"
  },
  {
    accessorKey: "notes",
    header: "Observaciones"
  }
]
