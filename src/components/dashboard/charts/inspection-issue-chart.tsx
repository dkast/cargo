"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"

export default function InspectionIssueChart({
  dataList,
  layout = "horizontal"
}: {
  dataList: { name: string; value: number }[]
  layout?: "vertical" | "horizontal"
}) {
  const chartConfig = {
    name: {
      label: "Total"
    }
  }
  return (
    <ChartContainer config={chartConfig} className="mt-8 max-h-[300px] w-full">
      {layout === "vertical" ? (
        <BarChart
          accessibilityLayer
          layout="vertical"
          data={dataList}
          margin={{
            right: 16
          }}
        >
          <CartesianGrid horizontal={false} />
          <XAxis dataKey="value" type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            hide
          />
          <ChartTooltip
            content={<ChartTooltipContent nameKey="name" indicator="line" />}
          />
          <Bar
            dataKey="value"
            layout="vertical"
            fill="var(--chart-1)"
            radius={4}
            barSize={40}
          >
            <LabelList
              dataKey="name"
              position="insideLeft"
              offset={8}
              className="fill-white"
              fontSize={12}
            />
            <LabelList
              dataKey="value"
              position="right"
              offset={8}
              className="fill-gray-900 dark:fill-gray-50"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      ) : (
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
      )}
    </ChartContainer>
  )
}
