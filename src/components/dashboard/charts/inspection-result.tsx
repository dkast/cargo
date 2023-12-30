import { BarChart, Callout, List, ListItem, Title } from "@tremor/react"
import { format } from "date-fns"
import { Activity, AlertTriangleIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { getInspectionResultCount } from "@/server/fetchers"
import { type InspectionQueryFilter } from "@/lib/types"

type ResultData = {
  result: string
  start: Date
  total: bigint
}

interface TransformedData {
  date: string
  [key: string]: string | number
}

export default async function InspectionResultChart({
  filter,
  className
}: {
  filter: InspectionQueryFilter
  className?: string
}) {
  const data = (await getInspectionResultCount(filter)) as ResultData[]

  // take the array and transform it into an array where the result is sum of the total and is grouped by date
  const transformedData = data.reduce(
    (acc: TransformedData[], item: ResultData) => {
      const date = format(item.start, "dd/MM/yy")
      const result = item.result === "PASS" ? "OK" : "Falla"
      const total = Number(item.total)

      const existing = acc.find(item => item.date === date)

      if (existing) {
        if (existing[result]) {
          existing[result] = Number(existing[result]) + total
        } else {
          existing[result] = total
        }
      } else {
        acc.push({
          date,
          [result]: total
        })
      }

      return acc
    },
    [] as TransformedData[]
  )

  const totalInspections = data.reduce(
    (acc, item) => acc + Number(item.total),
    0
  )

  const totalOK = data.reduce(
    (acc, item) => acc + Number(item.result === "PASS" ? item.total : 0),
    0
  )

  const totalIssues = data.reduce(
    (acc, item) => acc + Number(item.result === "FAIL" ? item.total : 0),
    0
  )

  const issuePercentage = Math.round((totalIssues / totalInspections) * 100)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Resultado de las Inspecciones
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Activity className="h-4 w-4" />
          <span className="text-sm">{`${totalInspections} inspecciones realizadas`}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex">
        <BarChart
          data={transformedData}
          index="date"
          categories={["OK", "Falla"]}
          colors={["green", "red"]}
          stack
          showAnimation
          animationDuration={500}
          noDataText="No hay datos para mostrar"
        />
        <div className="ml-2 hidden min-w-36 border-l border-gray-200 pl-4 lg:block">
          <Title className="text-xs uppercase tracking-wide">Detalle</Title>
          <List>
            <ListItem>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-green-500"></span>
                <span>OK</span>
              </div>
              <span>{totalOK}</span>
            </ListItem>
            <ListItem>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-red-500"></span>
                <span>Falla</span>
              </div>
              <span>{totalIssues}</span>
            </ListItem>
          </List>
          {issuePercentage > 5 && (
            <Callout
              title="Aviso"
              color="red"
              icon={AlertTriangleIcon}
              className="mt-4"
            >
              {issuePercentage}% de las inspecciones presentaron fallas
            </Callout>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
