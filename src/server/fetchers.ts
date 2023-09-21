import { unstable_cache as cache } from "next/cache"

import { prisma } from "@/server/db"

export async function getCompanies(organizationId: string) {
  // const companies = prisma.company.findMany({
  //   select: {
  //     id: true,
  //     name: true,
  //     organizationId: true
  //   }
  // })

  return await cache(
    async () => {
      return prisma.company.findMany({
        select: {
          id: true,
          name: true,
          organizationId: true
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
