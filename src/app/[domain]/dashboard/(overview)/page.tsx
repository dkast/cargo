import { Suspense } from "react"
import Filter from "@/app/[domain]/dashboard/(overview)/filter"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import CardSkeleton from "@/components/dashboard/charts/card-skeleton"
import InspectionIssueChart from "@/components/dashboard/charts/inspection-issue"
import InspectionRecent from "@/components/dashboard/charts/inspection-recent"
import InspectionResultChart from "@/components/dashboard/charts/inspection-result"
import InspectionStatusChart from "@/components/dashboard/charts/inspection-status"
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
    <div className="w-full">
      <section className="flex justify-end px-3">
        <Filter />
      </section>
      <section className="grid grid-cols-1 gap-4 px-3 py-4 sm:auto-rows-max sm:grid-cols-4">
        <Suspense
          fallback={
            <CardSkeleton className="sm:col-start-1 sm:col-end-2 sm:row-start-1 sm:row-end-3" />
          }
        >
          <InspectionStatusChart
            filter={filter}
            className="sm:col-start-1 sm:col-end-2 sm:row-start-1 sm:row-end-3"
          />
        </Suspense>
        <Suspense
          fallback={
            <CardSkeleton className="sm:col-start-2 sm:col-end-4 sm:row-start-1 sm:row-end-3" />
          }
        >
          <InspectionResultChart
            filter={filter}
            className="sm:col-start-2 sm:col-end-4 sm:row-start-1 sm:row-end-3"
          />
        </Suspense>
        <Suspense
          fallback={
            <CardSkeleton className="sm:col-start-4 sm:col-end-5 sm:row-start-1 sm:row-end-3" />
          }
        >
          <InspectionIssueChart
            filter={filter}
            type="LIST"
            showMore
            className="sm:col-start-4 sm:col-end-5 sm:row-start-1 sm:row-end-3"
          />
        </Suspense>
        <Suspense
          fallback={
            <CardSkeleton className="sm:col-start-1 sm:col-end-3 sm:row-start-3 sm:row-end-5" />
          }
        >
          <InspectionRecent
            filter={filter}
            className="sm:col-start-1 sm:col-end-3 sm:row-start-3 sm:row-end-5"
          />
        </Suspense>
      </section>
    </div>
  )
}
