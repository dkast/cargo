import { Suspense } from "react"
import CardSkeleton from "@/app/dashboard/(overview)/card-skeleton"
import { type Metadata } from "next"

import InspectionRecent from "@/components/dashboard/charts/inspection-recent"
import InspectionResultChart from "@/components/dashboard/charts/inspection-result"
import InspectionStatusChart from "@/components/dashboard/charts/inspection-status"

export const metadata: Metadata = {
  title: "Inicio"
}

export default async function DashboardPage() {
  return (
    <div className="w-full">
      <section className="grid grid-cols-1 gap-4 px-3 py-4 sm:grid-cols-4">
        <Suspense fallback={<CardSkeleton className="sm:col-span-1" />}>
          <InspectionStatusChart className="sm:col-span-1" />
        </Suspense>
        <Suspense fallback={<CardSkeleton className="sm:col-span-2" />}>
          <InspectionResultChart className="sm:col-span-2" />
        </Suspense>
        <Suspense fallback={<CardSkeleton className="sm:col-span-1" />}>
          <InspectionRecent className="sm:col-span-1" />
        </Suspense>
      </section>
    </div>
  )
}
