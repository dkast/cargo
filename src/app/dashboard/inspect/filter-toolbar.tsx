"use client"

import { today } from "@internationalized/date"
import { InspectionItemResult, InspectionStatus } from "@prisma/client"
import {
  parseAsArrayOf,
  parseAsString,
  useQueryState,
  useQueryStates
} from "next-usequerystate"

import { DataTableFilter } from "@/components/ui/data-table/data-table-filter"
import { DateRangePicker } from "@/components/ui/date-time-picker/date-range-picker"
import { calendarDateParser } from "@/lib/utils"

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
  const [dateValue, setDateValue] = useQueryStates(
    {
      start: calendarDateParser.withDefault(
        today("CST").subtract({ months: 1 })
      ),
      end: calendarDateParser.withDefault(today("CST"))
    },
    {
      shallow: false
    }
  )
  const [statusValue, setStatusValue] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString)
      .withOptions({
        shallow: false
      })
      .withDefault([])
  )
  const [resultValue, setResultValue] = useQueryState(
    "result",
    parseAsArrayOf(parseAsString)
      .withOptions({
        shallow: false
      })
      .withDefault([])
  )

  return (
    <>
      <div className="flex grow flex-row items-center gap-x-2">
        <DataTableFilter
          title="Estado"
          options={status}
          value={statusValue}
          onChange={setStatusValue}
        />
        <DataTableFilter
          title="Resultado"
          options={result}
          value={resultValue}
          onChange={setResultValue}
        />
      </div>
      <DateRangePicker
        value={dateValue}
        /*@ts-expect-error TODO: Review types for this*/
        onChange={setDateValue}
        maxValue={today("CST")}
      />
    </>
  )
}
