import { BarChart } from "@tremor/react"
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
      const date = format(item.start, "MMM dd")
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
          {totalIssues > 0 ? (
            <span className="text-sm">{`${totalInspections} inspecciones realizadas, ${totalIssues} con falla y ${totalOK} OK`}</span>
          ) : (
            <span className="text-sm">{`${totalInspections} inspecciones realizadas`}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <ul className="flex flex-wrap items-center gap-x-10 gap-y-4">
          <li>
            <div className="flex items-center space-x-2">
              <span className="size-3 shrink-0 bg-green-500"></span>
              <p className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {totalOK}
              </p>
            </div>
            <p className="whitespace-nowrap text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Inspecciones
            </p>
          </li>
          <li>
            <div className="flex items-center space-x-2">
              <span className="size-3 shrink-0 bg-red-500"></span>
              <p className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {totalIssues}
              </p>
            </div>
            <p className="whitespace-nowrap text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Con Falla
            </p>
          </li>
          {issuePercentage > 10 && (
            <li>
              <div className="rounded-md border-l-4 border-amber-400 bg-amber-50 p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangleIcon
                      className="h-5 w-5 text-amber-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-amber-700">
                      {issuePercentage}% de las inspecciones presentaron fallas
                    </p>
                  </div>
                </div>
              </div>
            </li>
          )}
        </ul>
        <BarChart
          data={transformedData}
          index="date"
          categories={["OK", "Falla"]}
          colors={["green", "red"]}
          stack
          tickGap={20}
          showAnimation
          animationDuration={500}
          showLegend={false}
          noDataText="No hay datos para mostrar"
          className="mt-10 h-64"
        />
        {/* {issuePercentage > 10 && (
          <Callout
            title="Aviso"
            color="amber"
            icon={AlertTriangleIcon}
            className="mt-4"
          >
            {issuePercentage}% de las inspecciones presentaron fallas
          </Callout>
        )} */}
      </CardContent>
    </Card>
  )
}
