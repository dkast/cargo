import { unstable_cache as cache } from "next/cache"

import { prisma } from "@/server/db"

export async function getCompanies(organizationId: string) {
  return await cache(
    async () => {
      return prisma.company.findMany({
        where: {
          organizationId: organizationId
        },
        select: {
          id: true,
          name: true,
          organizationId: true
        },
        orderBy: {
          name: "asc"
        }
      })
    },
    [`companies-${organizationId}`],
    {
      revalidate: 900,
      tags: [`companies-${organizationId}`]
    }
  )()
}

export async function getOperators(organizationId: string) {
  return await cache(
    async () => {
      return prisma.operator.findMany({
        where: {
          organizationId: organizationId
        },
        select: {
          id: true,
          name: true,
          licenseNumber: true,
          organizationId: true
        },
        orderBy: {
          name: "asc"
        }
      })
    },
    [`operators-${organizationId}`],
    {
      revalidate: 900,
      tags: [`operators-${organizationId}`]
    }
  )()
}
