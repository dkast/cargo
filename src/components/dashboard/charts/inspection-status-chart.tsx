"use client"

import { Label, Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart"

export default function InspectionStatusChart({
  data
}: {
  data: { status: string; total: number; fill: string }[]
}) {
  const chartConfig = {
    APPROVED: {
      label: "Aprobadas",
      color: "#8b5cf6"
    },
    CLOSED: {
      label: "Cerradas",
      color: "#3b82f6"
    },
    OPEN: {
      label: "En Proceso",
      color: "#f59e0b"
    }
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square min-h-[200px]"
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie
          data={data}
          dataKey={"total"}
          nameKey={"status"}
          innerRadius={60}
          strokeWidth={5}
          cornerRadius={10}
          paddingAngle={2}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) - 10}
                      className="fill-gray-900 text-2xl font-semibold dark:fill-gray-50"
                    >
                      {data.reduce((acc, item) => acc + item.total, 0)}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 14}
                      className="fill-gray-500 text-base dark:fill-gray-400"
                    >
                      Total
                    </tspan>
                  </text>
                )
              } else {
                return null
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
