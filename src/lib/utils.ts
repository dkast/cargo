import { clsx, type ClassValue } from "clsx"
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
