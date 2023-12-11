import { BarChart } from "@tremor/react"
import { format } from "date-fns"
import { Activity } from "lucide-react"

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

  // const totalOK = data.reduce(
  //   (acc, item) => acc + Number(item.result === "PASS" ? item.total : 0),
  //   0
  // )

  // const totalFail = data.reduce(
  //   (acc, item) => acc + Number(item.result === "FAIL" ? item.total : 0),
  //   0
  // )

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
      <CardContent>
        <BarChart
          data={transformedData}
          index="date"
          categories={["OK", "Falla"]}
          colors={["green", "red"]}
          stack
          showAnimation
        />
      </CardContent>
    </Card>
  )
}
