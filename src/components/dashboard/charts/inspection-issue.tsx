import { BarChart } from "@tremor/react"
import { Activity } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { getInspectionIssuesCount } from "@/server/fetchers"
import { type InspectionQueryFilter } from "@/lib/types"
import { cn } from "@/lib/utils"

type ResultData = {
  issue: string
  total: bigint
}

export default async function InspectionIssueChart({
  filter,
  className
}: {
  filter: InspectionQueryFilter
  className?: string
}) {
  const data = (await getInspectionIssuesCount(filter)) as ResultData[]

  const totalIssues = data.reduce((acc, item) => acc + Number(item.total), 0)

  console.dir(data)
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Incidencia de Fallas
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Activity className="h-4 w-4" />
          <span className="text-sm">
            {totalIssues} fallas encontradas en {data.length} inspecciones
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          data={data}
          index="issue"
          categories={["total"]}
          colors={["orange"]}
          showAnimation
          animationDuration={500}
          noDataText="No hay datos para mostrar"
        />
      </CardContent>
    </Card>
  )
}
