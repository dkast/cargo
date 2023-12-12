import { type DateValue, parseDate } from "@internationalized/date"
import { clsx, type ClassValue } from "clsx"
import { atomWithStorage } from "jotai/utils"
import { createParser } from "next-usequerystate"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get initials from name string
export function getInitials(name: string | undefined | null) {
  if (!name) return ""
  return name
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
}

// Can only approve if is owner or is admin or is supervisor
export function canApprove(role: string) {
  return role === "OWNER" || role === "ADMIN" || role === "SUPERVISOR"
}

export const isSidebarOpenAtom = atomWithStorage<boolean>(
  "is-sidebar-open",
  true
)

export const calendarDateParser = createParser({
  parse: (value: string) => {
    if (value === null) {
      return null
    }
    return parseDate(value)
  },
  serialize: (value: DateValue) => {
    return value.toString()
  }
})
