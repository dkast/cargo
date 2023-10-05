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

export async function getVehicles(organizationId: string) {
  return await cache(
    async () => {
      return prisma.vehicle.findMany({
        where: {
          organizationId: organizationId
        },
        select: {
          id: true,
          vehicleNbr: true,
          licensePlate: true,
          organizationId: true
        },
        orderBy: {
          vehicleNbr: "asc"
        }
      })
    },
    [`vehicles-${organizationId}`],
    {
      revalidate: 900,
      tags: [`vehicles-${organizationId}`]
    }
  )()
}

export async function getContainers(organizationId: string) {
  return await cache(
    async () => {
      return prisma.container.findMany({
        where: {
          organizationId: organizationId
        },
        select: {
          id: true,
          containerNbr: true,
          organizationId: true
        },
        orderBy: {
          containerNbr: "asc"
        }
      })
    },
    [`containers-${organizationId}`],
    {
      revalidate: 900,
      tags: [`containers-${organizationId}`]
    }
  )()
}

export async function getInspections(organizationId: string) {
  return await cache(
    async () => {
      return prisma.inspection.findMany({
        where: {
          organizationId: organizationId
        },
        select: {
          id: true,
          inspectionStart: true,
          inspectionStatus: true,
          organizationId: true,
          vehicle: {
            select: {
              id: true,
              vehicleNbr: true,
              licensePlate: true
            }
          },
          operator: {
            select: {
              id: true,
              name: true,
              licenseNumber: true
            }
          },
          company: {
            select: {
              id: true,
              name: true
            }
          },
          container: {
            select: {
              id: true,
              containerNbr: true
            }
          }
        },
        orderBy: {
          inspectionStart: "asc"
        }
      })
    },
    [`inspections-${organizationId}`],
    {
      revalidate: 900,
      tags: [`inspections-${organizationId}`]
    }
  )()
}
