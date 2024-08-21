import { Suspense } from "react"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import CardSkeleton from "@/components/dashboard/charts/card-skeleton"
import InspectionResultCard from "@/components/dashboard/charts/inspection-result-card"
import InspectionIssueList from "@/components/dashboard/ctpat/inspection-issue-list"
import DateFilter from "@/components/dashboard/date-filter"
import PageSubtitle from "@/components/dashboard/page-subtitle"
import { getOrganizationBySubDomain } from "@/server/fetchers"
import { type InspectionQueryFilter } from "@/lib/types"

export const metadata: Metadata = {
  title: "Reporte Inspecciones y Fallas"
}

export default async function MainReportPage({
  params: { domain },
  searchParams
}: {
  params: { domain: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const orgData = await getOrganizationBySubDomain(domain)

  if (!orgData) {
    notFound()
  }

  const filter: InspectionQueryFilter = {
    organizationId: orgData.id
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

  return (
    <div className="flex grow flex-col gap-y-6">
      <PageSubtitle
        title="Inspecciones y Fallas"
        description="Muestra las inspecciones CTPAT realizadas y las fallas encontradas"
      >
        <DateFilter />
      </PageSubtitle>
      <Suspense fallback={<CardSkeleton className="sm:col-span-2" />}>
        <InspectionResultCard filter={filter} className="sm:col-span-2" />
      </Suspense>
      <InspectionIssueList filter={filter} />
    </div>
  )
}
