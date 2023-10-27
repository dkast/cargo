"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { RangeCalendarState } from "react-stately"
import { CalendarDate, DateValue, parseDate } from "@internationalized/date"
import { InspectionItemResult, InspectionStatus } from "@prisma/client"

import { DataTableFilter } from "@/components/ui/data-table/data-table-filter"
import { DateRangePicker } from "@/components/ui/date-time-picker/date-range-picker"
import { Input } from "@/components/ui/input"

const status = [
  {
    value: InspectionStatus.OPEN,
    label: "En proceso"
  },
  {
    value: InspectionStatus.CLOSED,
    label: "Cerrado"
  },
  {
    value: InspectionStatus.APPROVED,
    label: "Aprobado"
  }
]

const result = [
  {
    value: InspectionItemResult.PASS,
    label: "OK"
  },
  {
    value: InspectionItemResult.FAIL,
    label: "Falla"
  }
]

export default function FilterToolbar() {
  const [dateValue, setDateValue] = useState({
    start: parseDate("2020-02-03"),
    end: parseDate("2020-02-08")
  })
  // const handleDateRangeChange: Dispatch<SetStateAction<RangeCalendarState>> = (value) => {
  //   setDateValue((prevValue) => ({
  //     ...prevValue,
  //     start: value.start as CalendarDate,
  //     end: value.end as CalendarDate,
  //   }));
  // }
  return (
    <div className="flex flex-row items-center justify-between py-2">
      <div className="flex flex-row items-center gap-x-2">
        <Input placeholder="Filtrar resultados..." className="h-8" />
        <DataTableFilter title="Estado" options={status} />
        <DataTableFilter title="Resultado" options={result} />
      </div>
      <DateRangePicker value={dateValue} />
    </div>
  )
}
