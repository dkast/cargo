"use client"

import { InspectionStatus, type Prisma } from "@prisma/client"
import { DonutChart, Legend, List, ListItem, type Color } from "@tremor/react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type getInspectionStatusCount } from "@/server/fetchers"

type StatusData = Prisma.PromiseReturnType<typeof getInspectionStatusCount>

export default function InspectionStatusChart({
  data,
  className
}: {
  data: StatusData
  className?: string
}) {
  const transformedData = data.map(item => {
    let status = ""
    let color: Color = "gray"
    switch (item.status) {
      case InspectionStatus.APPROVED:
        ;(status = "Aprobadas"), (color = "green")
        break
      case InspectionStatus.CLOSED:
        status = "Cerradas"
        color = "blue"
        break
      case InspectionStatus.OPEN:
        ;(status = "En Proceso"), (color = "yellow")
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

  console.log(data)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Estatus de inspecciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <Legend
            categories={transformedData.map(item => item.status)}
            colors={transformedData.map(item => item.color)}
          />
          <DonutChart
            data={transformedData}
            index="status"
            category="total"
            colors={transformedData.map(item => item.color)}
            showAnimation
          />
          <List>
            {transformedData.map(item => (
              <ListItem key={item.status}>
                <span>{item.status}</span>
                <span>{item.total}</span>
              </ListItem>
            ))}
          </List>
        </div>
      </CardContent>
    </Card>
  )
}
