import { BarChart } from "@tremor/react"
import { format } from "date-fns"

type ResultData = {
  result: string
  start: Date
  total: bigint
}[]

export default function InspectionResultChart({ data }: { data: ResultData }) {
  console.log(data)

  // use item.result as category
  const transformedData = data.map(item => {
    return {
      date: format(item.start, "dd/MM/yyyy"),
      [item.result]: item.total
    }
  })

  console.log(transformedData)

  return (
    <div>
      <BarChart
        data={transformedData}
        index="date"
        categories={["FAIL", "PASS"]}
        stack
      />
    </div>
  )
}
