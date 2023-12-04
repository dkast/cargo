"use client"

import React, { useRef, useState } from "react"
import {
  useDateRangePicker,
  useInteractOutside,
  type DateValue
} from "react-aria"
import {
  useDateRangePickerState,
  type DateRangePickerStateOptions
} from "react-stately"
import { CalendarIcon } from "lucide-react"

import { RangeCalendar } from "@/components/ui/date-time-picker/range-calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { useForwardedRef } from "@/lib/use-forwarded-ref"
import { cn } from "@/lib/utils"
import { Button } from "../button"
import { DateField } from "./date-field"

const DateRangePicker = React.forwardRef<
  HTMLDivElement,
  DateRangePickerStateOptions<DateValue>
>((props, forwardedRef) => {
  const state = useDateRangePickerState(props)
  const ref = useForwardedRef(forwardedRef)
  const contentRef = useRef<HTMLDivElement | null>(null)

  const [open, setOpen] = useState(false)

  const {
    groupProps,
    startFieldProps,
    endFieldProps,
    buttonProps,
    dialogProps,
    calendarProps
  } = useDateRangePicker(props, state, ref)
  useInteractOutside({
    ref: contentRef,
    onInteractOutside: () => {
      setOpen(false)
    }
  })

  return (
    <div
      {...groupProps}
      ref={ref}
      className={cn(
        groupProps.className,
        "flex w-[236px] items-center rounded-md ring-offset-white focus-within:ring-2 focus-within:ring-gray-950 focus-within:ring-offset-2"
      )}
    >
      <div className="flex h-8 flex-row items-center justify-between rounded-l-md border border-r-0">
        <DateField {...startFieldProps} />
        <span aria-hidden="true" className="text-gray-700">
          -
        </span>
        <DateField {...endFieldProps} />
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            {...buttonProps}
            variant="outline"
            size="xs"
            className="rounded-l-none"
            disabled={props.isDisabled}
            onClick={() => setOpen(true)}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent ref={contentRef} className="w-full">
          <div {...dialogProps} className="space-y-3">
            <RangeCalendar
              {...calendarProps}
              onChange={newDateRange => {
                props.onChange ? props.onChange(newDateRange) : null
                setOpen(false)
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
})

DateRangePicker.displayName = "DateRangePicker"

export { DateRangePicker }
