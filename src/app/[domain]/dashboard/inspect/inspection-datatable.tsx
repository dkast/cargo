"use client"

import { columns } from "@/app/[domain]/dashboard/inspect/columns"
import FilterToolbar from "@/app/[domain]/dashboard/inspect/filter-toolbar"
import { type Prisma } from "@prisma/client"
import { type Row } from "@tanstack/react-table"
import { useRouter } from "next/navigation"

import { DataTable } from "@/components/ui/data-table/data-table"
import { type getInspections } from "@/server/fetchers"

type InspectionMaster = Prisma.PromiseReturnType<typeof getInspections>

export default function InspectionDataTable({
  data
}: {
  data: InspectionMaster
}) {
  const router = useRouter()

  const onRowClick = (row: Row<InspectionMaster[number]>) => {
    // console.log(row.original)
    router.push(`ctpat/${row.original.id}`)
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      toolbar={<FilterToolbar />}
      onRowClick={onRowClick}
    />
  )
}
