"use client"

import { today } from "@internationalized/date"
import { useQueryStates } from "next-usequerystate"

import { DateRangePicker } from "@/components/ui/date-time-picker/date-range-picker"
import { calendarDateParser } from "@/lib/utils"

export default function Filter() {
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
  return (
    <DateRangePicker
      value={dateValue}
      /*@ts-expect-error TODO: Review types for this*/
      onChange={setDateValue}
      maxValue={today("CST")}
    />
  )
}
