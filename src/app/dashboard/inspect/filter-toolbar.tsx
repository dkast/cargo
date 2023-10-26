"use client"

import { DateRangePicker } from "@/components/ui/date-time-picker/date-range-picker"
import { Input } from "@/components/ui/input"

export default function FilterToolbar() {
  return (
    <div className="flex flex-row items-center justify-between py-2">
      <div>
        <Input placeholder="Buscar por folio..." />
      </div>
      <DateRangePicker />
    </div>
  )
}
