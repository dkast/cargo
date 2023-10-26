import { columns } from "@/app/dashboard/inspect/columns"
import FilterToolbar from "@/app/dashboard/inspect/filter-toolbar"
import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DateRangePicker } from "@/components/ui/date-time-picker/date-range-picker"
import { getInspections } from "@/server/fetchers"
import { getCurrentUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Inspecciones CTPAT"
}

export default async function CTPATPage() {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  const data = await getInspections(user?.organizationId)

  return (
    <div className="mx-auto grow px-4 sm:px-6">
      <PageSubtitle title="CTPAT" description="Inspecciones CTPAT">
        <Button asChild>
          <Link href="/dashboard/ctpat/edit/new">Nueva Inspección</Link>
        </Button>
      </PageSubtitle>
      <div className="mt-6">
        <FilterToolbar />
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}
