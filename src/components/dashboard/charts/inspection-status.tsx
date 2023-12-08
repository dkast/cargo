"use client"

import { InspectionStatus, type Prisma } from "@prisma/client"
import { DonutChart, Legend } from "@tremor/react"

import { type getInspectionStatusCount } from "@/server/fetchers"

type StatusData = Prisma.PromiseReturnType<typeof getInspectionStatusCount>

export default function InspectionStatusChart({ data }: { data: StatusData }) {
  const transformedData = data.map(item => {
    let status = ""
    switch (item.status) {
      case InspectionStatus.APPROVED:
        status = "Aprobadas"
        break
      case InspectionStatus.OPEN:
        status = "Abiertas"
        break
      case InspectionStatus.CLOSED:
        status = "Cerradas"
        break
      default:
        status = "Desconocido"
    }
    return {
      status: status,
      total: item._count.status
    }
  })

  console.log(transformedData)

  return (
    <div className="flex flex-col items-center gap-4">
      <Legend categories={transformedData.map(item => item.status)} />
      <DonutChart data={transformedData} index="status" category="total" />
    </div>
  )
}
