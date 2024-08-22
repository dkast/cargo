import { Suspense } from "react"
import Filter from "@/app/[domain]/dashboard/(overview)/filter"
import { InspectionType } from "@prisma/client"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import CardSkeleton from "@/components/dashboard/charts/card-skeleton"
import InspectionIssueChart from "@/components/dashboard/charts/inspection-issue-card"
import InspectionLocationCard from "@/components/dashboard/charts/inspection-location-card"
import InspectionRecent from "@/components/dashboard/charts/inspection-recent"
import InspectionResultCard from "@/components/dashboard/charts/inspection-result-card"
import InspectionStatusCard from "@/components/dashboard/charts/inspection-status-card"
import { getOrganizationBySubDomain } from "@/server/fetchers"
import { type InspectionQueryFilter } from "@/lib/types"

export const metadata: Metadata = {
  title: "Inicio"
}

export default async function DashboardPage({
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
    organizationId: orgData.id,
    inspectionType: InspectionType.CTPAT
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
    <div className="w-full">
      <section className="flex justify-end px-3">
        <Filter />
      </section>
      <section className="grid grid-cols-1 gap-4 px-3 py-4 md:grid-cols-2 lg:auto-rows-max lg:grid-cols-4">
        <Suspense
          fallback={
            <CardSkeleton className="lg:col-start-4 lg:col-end-5 lg:row-start-1 lg:row-end-3" />
          }
        >
          <InspectionLocationCard
            filter={filter}
            className="lg:col-start-4 lg:col-end-5 lg:row-start-1 lg:row-end-5"
          />
        </Suspense>
        <Suspense
          fallback={
            <CardSkeleton className="lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3" />
          }
        >
          <InspectionStatusCard
            filter={filter}
            className="lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3"
          />
        </Suspense>
        <Suspense
          fallback={
            <CardSkeleton className="lg:col-start-2 lg:col-end-4 lg:row-start-1 lg:row-end-3" />
          }
        >
          <InspectionResultCard
            filter={filter}
            className="lg:col-start-2 lg:col-end-4 lg:row-start-1 lg:row-end-3"
          />
        </Suspense>
        <Suspense
          fallback={
            <CardSkeleton className="lg:col-start-1 lg:col-end-3 lg:row-start-3 lg:row-end-5" />
          }
        >
          <InspectionRecent
            filter={filter}
            className="lg:col-start-1 lg:col-end-3 lg:row-start-3 lg:row-end-5"
          />
        </Suspense>
        <Suspense
          fallback={
            <CardSkeleton className="lg:col-start-3 lg:col-end-4 lg:row-start-3 lg:row-end-5" />
          }
        >
          <InspectionIssueChart
            filter={filter}
            type="LIST"
            showMore
            className="lg:col-start-3 lg:col-end-4 lg:row-start-3 lg:row-end-5"
          />
        </Suspense>
      </section>
    </div>
  )
}
