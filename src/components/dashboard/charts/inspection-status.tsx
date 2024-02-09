import { InspectionStatus } from "@prisma/client"
import { DonutChart, List, ListItem, type Color } from "@tremor/react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getInspectionStatusCount } from "@/server/fetchers"
import { type InspectionQueryFilter } from "@/lib/types"
import { cn } from "@/lib/utils"

const color = {
  amber: "bg-amber-100 text-amber-500",
  blue: "bg-blue-100 text-blue-500",
  violet: "bg-violet-100 text-violet-500",
  gray: "bg-gray-100 text-gray-500"
}

export default async function InspectionStatusChart({
  filter,
  className
}: {
  filter: InspectionQueryFilter
  className?: string
}) {
  const data = await getInspectionStatusCount(filter)

  const transformedData = data.map(item => {
    let status = ""
    let color: Color = "gray"
    switch (item.status) {
      case InspectionStatus.APPROVED:
        status = "Aprobadas"
        color = "violet"
        break
      case InspectionStatus.CLOSED:
        status = "Cerradas"
        color = "blue"
        break
      case InspectionStatus.OPEN:
        status = "En Proceso"
        color = "amber"
        break
      default:
        status = "Desconocido"
        color = "gray"
    }
    return {
      status: status,
      color: color,
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
          <DonutChart
            data={transformedData}
            index="status"
            category="total"
            colors={transformedData.map(item => item.color)}
            showAnimation
            animationDuration={500}
            noDataText="No hay datos para mostrar"
          />
          <p className="mt-8 flex w-full items-center justify-between text-tremor-label text-tremor-content dark:text-dark-tremor-content">
            <span>Estatus</span>
            <span>Total</span>
          </p>
          <List>
            {transformedData.map(item => (
              <ListItem key={item.status}>
                <div className="flex flex-row items-center gap-2">
                  <div
                    className={cn(
                      color[item.color],
                      "flex-none rounded-full p-1"
                    )}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                  </div>
                  {item.status}
                </div>
                <span>{item.total}</span>
              </ListItem>
            ))}
          </List>
        </div>
      </CardContent>
    </Card>
  )
}
