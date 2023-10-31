import { columns } from "@/app/dashboard/inspect/columns"
import FilterToolbar from "@/app/dashboard/inspect/filter-toolbar"
import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table/data-table"
import { getInspections } from "@/server/fetchers"
import { getCurrentUser } from "@/lib/session"
import { type InspectionQueryFilter } from "@/lib/types"

export const metadata: Metadata = {
  title: "Inspecciones CTPAT"
}
export default async function CTPATPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  const filter: InspectionQueryFilter = {
    organizationId: user.organizationId
  }
  if (searchParams.status) {
    if (typeof searchParams.status === "string") {
      filter.status = searchParams.status
    } else {
      filter.status = undefined
    }
  }
  if (searchParams.result) {
    if (typeof searchParams.result === "string") {
      filter.result = searchParams.result
    } else {
      filter.result = undefined
    }
  }
  if (searchParams.start) {
    if (typeof searchParams.start === "string") {
      filter.start = searchParams.start
    } else {
      filter.start = undefined
    }
  }
  if (searchParams.end) {
    if (typeof searchParams.end === "string") {
      filter.end = searchParams.end
    } else {
      filter.end = undefined
    }
  }

  console.log(filter)
  console.log(searchParams)
  const data = await getInspections(filter)

  return (
    <div className="mx-auto grow px-4 sm:px-6">
      <PageSubtitle title="CTPAT" description="Inspecciones CTPAT">
        <Button asChild>
          <Link href="/dashboard/ctpat/edit/new">Nueva Inspección</Link>
        </Button>
      </PageSubtitle>
      <div className="mt-6">
        <DataTable columns={columns} data={data} toolbar={<FilterToolbar />} />
      </div>
    </div>
  )
}
