"use client"

import { Suspense } from "react"
import { columns } from "@/app/admin/columns"
import type { Organization } from "@prisma/client"
import type { Row } from "@tanstack/react-table"
import { useRouter } from "next/navigation"

import { DataTable } from "@/components/ui/data-table/data-table"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrganizationDataTable({
  data
}: {
  data: Organization[]
}) {
  const router = useRouter()

  const onRowClick = (row: Row<Organization>) => {
    router.push(`/${row.original.subdomain}/dashboard`)
  }

  return (
    <Suspense fallback={<LoadingTable />}>
      <DataTable data={data} columns={columns} onRowClick={onRowClick} />
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
