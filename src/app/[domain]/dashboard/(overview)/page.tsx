import { Suspense } from "react"
import Filter from "@/app/[domain]/dashboard/(overview)/filter"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import CardSkeleton from "@/components/dashboard/charts/card-skeleton"
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
      <section className="grid grid-cols-1 gap-4 px-3 py-4 sm:grid-cols-4">
        <Suspense fallback={<CardSkeleton className="sm:col-span-1" />}>
          <InspectionStatusChart filter={filter} className="sm:col-span-1" />
        </Suspense>
        <Suspense fallback={<CardSkeleton className="sm:col-span-2" />}>
          <InspectionResultChart filter={filter} className="sm:col-span-2" />
        </Suspense>
        <Suspense fallback={<CardSkeleton className="sm:col-span-1" />}>
          <InspectionRecent filter={filter} className="sm:col-span-1" />
        </Suspense>
      </section>
    </div>
  )
}
