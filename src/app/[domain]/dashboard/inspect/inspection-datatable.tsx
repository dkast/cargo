"use client"

import { Suspense } from "react"
import { columns } from "@/app/[domain]/dashboard/inspect/columns"
import FilterToolbar from "@/app/[domain]/dashboard/inspect/filter-toolbar"
import { type Prisma } from "@prisma/client"
import { type Row } from "@tanstack/react-table"
import { useRouter } from "next/navigation"

import { DataTable } from "@/components/ui/data-table/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { type getInspections } from "@/server/fetchers/ctpat"

type InspectionMaster = Prisma.PromiseReturnType<typeof getInspections>

export default function InspectionDataTable({
  data
}: {
  data: InspectionMaster
}) {
  const router = useRouter()

  const onRowClick = (row: Row<InspectionMaster[number]>) => {
    router.push(`ctpat/${row.original.id}`)
  }

  return (
    <Suspense fallback={<LoadingTable />}>
      <DataTable
        columns={columns}
        data={data}
        toolbar={<FilterToolbar />}
        onRowClick={onRowClick}
      />
    </Suspense>
  )
}

function LoadingTable() {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="h-8 w-1/2 sm:w-64" />
      <Skeleton className="h-[200px] w-full" />
    </div>
  )
}
