import { BarChart, BarList } from "@tremor/react"
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
  className,
  type = "CHART"
}: {
  filter: InspectionQueryFilter
  className?: string
  type: "CHART" | "LIST"
}) {
  const data = (await getInspectionIssuesCount(filter)) as ResultData[]
  const dataList = data.map(item => ({
    name: item.issue,
    value: Number(item.total)
  }))

  const totalIssues = data.reduce((acc, item) => acc + Number(item.total), 0)

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Resúmen de Fallas
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Activity className="h-4 w-4" />
          <span className="text-sm">
            {totalIssues} fallas encontradas en {data.length} inspecciones
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {type === "LIST" ? (
          <BarList data={dataList} color="orange" />
        ) : (
          <BarChart
            data={data}
            index="issue"
            categories={["total"]}
            colors={["orange"]}
            showAnimation
            animationDuration={500}
            noDataText="No hay datos para mostrar"
          />
        )}
      </CardContent>
    </Card>
  )
}
