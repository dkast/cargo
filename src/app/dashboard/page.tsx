import { format } from "date-fns"
import { es } from "date-fns/locale"
import { type Metadata } from "next"

import InspectionRecent from "@/components/dashboard/charts/inspection-recent"
import InspectionResultChart from "@/components/dashboard/charts/inspection-result"
import InspectionStatusChart from "@/components/dashboard/charts/inspection-status"
import PageHeader from "@/components/dashboard/page-header"
import {
  getInspectionResultCount,
  getInspectionStatusCount
} from "@/server/fetchers"
import { getCurrentUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Inicio"
}

type ResultData = {
  result: string
  start: Date
  total: bigint
}[]

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) return null

  const humanDate = format(new Date(), "EEEE, d MMMM yyyy", { locale: es })
  const greeting = user.name ? `Hola, ${user.name.split(" ")[0]}` : "Hola"

  const statusData = await getInspectionStatusCount(user.organizationId)
  const resultData = (await getInspectionResultCount(
    user.organizationId
  )) as ResultData

  return (
    <>
      <PageHeader title={greeting} description={humanDate}></PageHeader>
      <section className="grid grid-cols-1 gap-4 px-3 py-4 sm:grid-cols-4">
        <InspectionStatusChart data={statusData} className="sm:col-span-1" />
        <InspectionResultChart data={resultData} className="sm:col-span-2" />
        <InspectionRecent className="sm:col-span-1" />
      </section>
    </>
  )
}
