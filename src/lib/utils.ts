import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//Get initials from name string
export function getInitials(name: string) {
  return name
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
}
