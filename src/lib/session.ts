import { cache } from "react"

import { auth } from "@/lib/auth"

export const getCurrentUser = cache(async () => {
  const session = await auth()

  return session?.user ?? null
})

export const getUserTimeZone = cache(async () => {
  const user = await getCurrentUser()

  return user?.timezone ?? "UTC"
})
