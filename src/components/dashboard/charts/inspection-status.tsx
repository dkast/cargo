import { InspectionStatus } from "@prisma/client"
import { DonutChart, List, ListItem, type Color } from "@tremor/react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getInspectionStatusCount } from "@/server/fetchers"
import { getCurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"

const color = {
  yellow: "bg-amber-100 text-amber-500",
  blue: "bg-blue-100 text-blue-500",
  green: "bg-green-100 text-green-500",
  gray: "bg-gray-100 text-gray-500"
}

export default async function InspectionStatusChart({
  className
}: {
  className?: string
}) {
  const user = await getCurrentUser()

  if (!user) return null

  const data = await getInspectionStatusCount(user.organizationId)

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
