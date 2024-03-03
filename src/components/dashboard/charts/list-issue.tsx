"use client"

import { BarList } from "@tremor/react"

import { ScrollArea } from "@/components/ui/scroll-area"

type ListData = {
  name: string
  value: number
}[]

export default function ListIssue({ dataList }: { dataList: ListData }) {
  return (
    <ScrollArea className="relative h-80 px-4">
      <BarList data={dataList} color="amber" className="pb-4" />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-white to-transparent py-5"></div>
    </ScrollArea>
  )
}
