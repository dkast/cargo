"use server"

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { unstable_cache as cache } from "next/cache"
import { redirect } from "next/navigation"

import { prisma } from "@/server/db"
import { getCurrentUser } from "@/lib/session"
import { env } from "@/env.mjs"

// Create an Cloudflare R2 service client object
const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_KEY_ID
  }
})

export async function getOrganizationById(organizationId: string) {
  return await cache(
    async () => {
      const data = await prisma.organization.findUnique({
        where: {
          id: organizationId
        }
      })

      // Replace fileUrl with a signed URL
      if (data?.image) {
        data.image = await getSignedUrl(
          R2,
          new GetObjectCommand({
            Bucket: env.R2_BUCKET_NAME,
            Key: data.image
          }),
          { expiresIn: 3600 * 24 }
        )
      }

      return data
    },
    [`organization-${organizationId}`],
    {
      revalidate: 900,
      tags: [`organization-${organizationId}`]
    }
  )()
}

export async function getOrganizationBySubDomain(domain: string) {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const orgData = await cache(
    async () => {
      return prisma.organization.findUnique({
        where: {
          subdomain: domain
        }
      })
    },
    [`organization-${domain}`],
    {
      revalidate: 300,
      tags: [`organization-${domain}`]
    }
  )()

  // Replace fileUrl with a signed URL
  if (orgData?.image) {
    orgData.image = await getSignedUrl(
      R2,
      new GetObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: orgData.image
      }),
      { expiresIn: 3600 * 24 }
    )
  }

  // Find the user's membership for the organization
  const membershipData = await cache(
    async () => {
      return prisma.membership.findFirst({
        where: {
          userId: user.id,
          organizationId: orgData?.id,
          isActive: true
        }
      })
    },
    [`membership-${user.id}-${orgData?.id}`],
    {
      revalidate: 300,
      tags: [`membership-${user.id}-${orgData?.id}`]
    }
  )()

  if (!membershipData) {
    return redirect("/access-denied")
  }

  if (orgData && membershipData) {
    return orgData
  }
}

export async function getMemberById(memberId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return await cache(
    async () => {
      return prisma.membership.findUnique({
        where: {
          id: memberId
        },
        select: {
          id: true,
          role: true,
          organizationId: true,
          isActive: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              username: true,
              image: true,
              defaultMembershipId: true
            }
          }
        }
      })
    },
    [`member-${memberId}`],
    {
      revalidate: 900,
      tags: [`member-${memberId}`]
    }
  )()
}

export async function getUserMemberships(userId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return await cache(
    async () => {
      const data = await prisma.membership.findMany({
        where: {
          userId: userId,
          isActive: true
        },
        select: {
          id: true,
          role: true,
          organization: {
            select: {
              id: true,
              name: true,
              subdomain: true,
              image: true
            }
          }
        }
      })

      for (const org of data) {
        if (org.organization.image) {
          org.organization.image = await getSignedUrl(
            R2,
            new GetObjectCommand({
              Bucket: env.R2_BUCKET_NAME,
              Key: org.organization.image
            }),
            { expiresIn: 3600 * 24 }
          )
        }
      }

      return data
    },
    [`user-organizations-${userId}`],
    {
      revalidate: 900,
      tags: [`user-organizations-${userId}`]
    }
  )()
}

export async function getLocations(organizationId: string, onlyActive = false) {
  return await cache(
    async () => {
      return prisma.location.findMany({
        where: {
          organizationId: organizationId,
          isActive: onlyActive ? true : undefined
        },
        select: {
          id: true,
          name: true,
          description: true,
          isActive: true,
          organizationId: true
        },
        orderBy: {
          name: "asc"
        }
      })
    },
    [`locations-${organizationId}-onlyActive-${onlyActive}`],
    {
      revalidate: 900,
      tags: [`locations-${organizationId}-onlyActive-${onlyActive}`]
    }
  )()
}

export async function getLocationsBySubDomain(
  domain: string,
  onlyActive = false
) {
  const orgData = await getOrganizationBySubDomain(domain)

  if (orgData) {
    return await getLocations(orgData.id, onlyActive)
  }
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
