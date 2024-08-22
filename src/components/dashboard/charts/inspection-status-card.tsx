import { InspectionStatus } from "@prisma/client"

import InspectionStatusChart from "@/components/dashboard/charts/inspection-status-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getInspectionStatusCount } from "@/server/fetchers/ctpat"
import { type InspectionQueryFilter } from "@/lib/types"
import { cn } from "@/lib/utils"

const color = {
  OPEN: "bg-amber-100 text-amber-500 dark:bg-amber-950",
  CLOSED: "bg-blue-100 text-blue-500 dark:bg-blue-950",
  APPROVED: "bg-violet-100 text-violet-500 dark:bg-violet-950",
  UNKOWN: "bg-gray-100 text-gray-500 dark:bg-gray-950"
}

export default async function InspectionStatusCard({
  filter,
  className
}: {
  filter: InspectionQueryFilter
  className?: string
}) {
  const data = await getInspectionStatusCount(filter)

  const transformedData = data.map(item => {
    let label = ""
    let color = ""
    switch (item.status) {
      case InspectionStatus.APPROVED:
        label = "Aprobadas"
        color = "var(--color-APPROVED)"
        break
      case InspectionStatus.CLOSED:
        label = "Cerradas"
        color = "var(--color-CLOSED)"
        break
      case InspectionStatus.OPEN:
        label = "En Proceso"
        color = "var(--color-OPEN)"
        break
      default:
        label = "Desconocido"
        color = "var(--color-UNKNOWN)"
    }
    return {
      status: item.status,
      label,
      fill: color,
      total: item._count.status
    }
  })

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Estatus de inspecciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-2">
          <InspectionStatusChart data={transformedData} />
          <p className="mt-8 flex w-full items-center justify-between text-tremor-label text-tremor-content dark:text-dark-tremor-content">
            <span>Estatus</span>
            <span>Total</span>
          </p>
          <div className="flex w-full flex-col divide-y text-sm dark:divide-gray-800">
            {transformedData.map(item => (
              <div
                key={item.status}
                className="flex h-full justify-between py-2"
              >
                <div className="flex flex-row items-center gap-2">
                  <div
                    className={cn(
                      color[item.status],
                      "flex-none rounded-full p-1"
                    )}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                  </div>
                  {item.label}
                </div>
                <span>{item.total}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
