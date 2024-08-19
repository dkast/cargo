"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"

export default function InspectionIssueChart({
  dataList
}: {
  dataList: { name: string; value: number }[]
}) {
  const chartConfig = {
    name: {
      label: "Total"
    }
  }
  return (
    <ChartContainer
      config={chartConfig}
      className="mt-8 max-h-[250px] min-h-[150px] w-full"
    >
      <BarChart accessibilityLayer data={dataList}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
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
        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
        <Bar dataKey="value" fill="var(--chart-1)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
