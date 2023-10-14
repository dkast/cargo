import { unstable_cache as cache } from "next/cache"

import { prisma } from "@/server/db"

export async function getOrganization(organizationId: string) {
  return await cache(
    async () => {
      return prisma.organization.findFirst({
        where: {
          id: organizationId
        }
      })
    },
    [`organization-${organizationId}`],
    {
      revalidate: 900,
      tags: [`organization-${organizationId}`]
    }
  )()
}

export async function getMembers(organizationId: string) {
  return await cache(
    async () => {
      return prisma.membership.findMany({
        where: {
          organizationId: organizationId
        },
        include: {
          user: true
        }
      })
    },
    [`members-${organizationId}`],
    {
      revalidate: 900,
      tags: [`members-${organizationId}`]
    }
  )()
}

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
          inspectionNbr: true,
          inspectedBy: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          start: true,
          status: true,
          result: true,
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
          start: "asc"
        }
      })
    },
    [`ctpatInspections-${organizationId}`],
    {
      revalidate: 900,
      tags: [`ctpatInspections-${organizationId}`]
    }
  )()
}

export async function getInspectionById(inspectionId: string) {
  return prisma.inspection.findFirst({
    where: {
      id: inspectionId
    },
    select: {
      id: true,
      inspectionNbr: true,
      inspectedBy: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      start: true,
      status: true,
      isLoaded: true,
      tripType: true,
      sealNbr: true,
      tiresVehicle: true,
      tiresContainer: true,
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
      },
      inspectionItems: {
        select: {
          id: true,
          question: true,
          result: true,
          notes: true,
          order: true
        }
      }
    }
  })
}
