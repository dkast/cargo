import { BarChart } from "@tremor/react"
import { Activity, ArrowRight } from "lucide-react"
import Link from "next/link"

import ListIssue from "@/components/dashboard/charts/list-issue"
import InfoHelper from "@/components/dashboard/info-helper"
import { Button } from "@/components/ui/button"
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
  type = "CHART",
  showMore
}: {
  filter: InspectionQueryFilter
  className?: string
  type: "CHART" | "LIST"
  showMore?: boolean
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
        <div className="flex flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle className="text-base font-medium">
              Resúmen de Fallas
              <InfoHelper>
                Lista el total de incidencias por tipo de falla en el periodo
                seleccionado
              </InfoHelper>
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              <span className="text-sm">{totalIssues} fallas encontradas</span>
            </CardDescription>
          </div>
          {showMore && (
            <Button asChild size="xs" variant="ghost" className="text-xs">
              <Link href="dashboard/reports/ctpat-issues">
                Ver más <ArrowRight className="ml-1 opacity-70" size={16} />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        {type === "LIST" ? (
          <ListIssue dataList={dataList} />
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
