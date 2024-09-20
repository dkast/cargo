import { parseDate, type DateValue } from "@internationalized/date"
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
    .toLocaleUpperCase()
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

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production")
    return "https://cargohq.vercel.app"
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview")
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  return "http://localhost:3000"
}

export const getTimezones = (): string[] => {
  // const timezones: string[] = []
  const allTimezones = Intl.supportedValuesOf("timeZone")
  const americaTimezones = allTimezones.filter(tz => tz.startsWith("America"))
  // timezones.push(...americaTimezones)
  return americaTimezones
}
