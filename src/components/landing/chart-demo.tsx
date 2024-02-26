import { BarChart } from "@/components/dashboard/charts/tremor-client"

const data = [
  { date: "01/01/23", OK: 10, Falla: 2 },
  { date: "02/01/23", OK: 8, Falla: 1 },
  { date: "03/01/23", OK: 15, Falla: 2 },
  { date: "04/01/23", OK: 12, Falla: 3 },
  { date: "05/01/23", OK: 7, Falla: 2 },
  { date: "06/01/23", OK: 9, Falla: 1 },
  { date: "07/01/23", OK: 11, Falla: 2 },
  { date: "08/01/23", OK: 14, Falla: 3 },
  { date: "09/01/23", OK: 10, Falla: 2 },
  { date: "10/01/23", OK: 12, Falla: 1 },
  { date: "11/01/23", OK: 13, Falla: 2 },
  { date: "12/01/23", OK: 9, Falla: 1 }
]

export default function ChartDemo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <BarChart
        data={data}
        index="date"
        categories={["OK", "Falla"]}
        colors={["green", "red"]}
        stack
        showAnimation
        showTooltip={false}
        animationDuration={500}
        noDataText="No hay datos para mostrar"
      />
    </div>
  )
}
