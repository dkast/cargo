"use client"

import { columns } from "@/app/[domain]/dashboard/reports/ctpat-issues/columns"
import { type Prisma } from "@prisma/client"
import { type Row } from "@tanstack/react-table"
import { useRouter } from "next/navigation"

import { DataTable } from "@/components/ui/data-table/data-table"
import { type getInspectionIssues } from "@/server/fetchers"

type getInspectionIssues = Prisma.PromiseReturnType<typeof getInspectionIssues>

export default function IssueDataTable({
  data
}: {
  data: getInspectionIssues
}) {
  const router = useRouter()

  const onRowClick = (row: Row<getInspectionIssues[number]>) => {
    router.push(`/dashboard/ctpat/${row.original.inspection.id}`)
  }

  return <DataTable columns={columns} data={data} onRowClick={onRowClick} />
}
