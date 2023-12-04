import { Client } from "@planetscale/database"
import { PrismaPlanetScale } from "@prisma/adapter-planetscale"
import { PrismaClient } from "@prisma/client"

import { env } from "@/env.mjs"

const client = new Client({ url: env.DATABASE_URL })
const adapter = new PrismaPlanetScale(client)
export const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
})
