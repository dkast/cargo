"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart"
import { type TransformedData } from "./inspection-result"

export default function InspectionResultChart({
  data
}: {
  data: TransformedData[]
}) {
  const chartConfig = {
    Falla: {
      label: "Falla",
      color: "#ed4720"
    },
    OK: {
      label: "OK",
      color: "#10b981"
    }
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={chartConfig}
      className="mt-8 max-h-[250px] min-h-[150px] w-full"
    >
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          allowDecimals={true}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="OK" fill="var(--color-OK)" stackId="a" />
        <Bar dataKey="Falla" fill="var(--color-Falla)" stackId="a" />
      </BarChart>
    </ChartContainer>
  )
}
