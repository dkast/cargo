"use server"

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { MembershipRole } from "@prisma/client"
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

export async function getOrganizations() {
  const user = await getCurrentUser()

  // if the user is not logged in and is not an admin, return null
  if (!user || user.role !== MembershipRole.ADMIN) {
    return []
  }

  return await cache(
    async () => {
      return await prisma.organization.findMany()
    },
    ["organizations"],
    {
      revalidate: 900,
      tags: ["organizations"]
    }
  )()
}

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
      return await prisma.organization.findUnique({
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
      return await prisma.membership.findFirst({
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

  if (!membershipData || orgData?.status === "INACTIVE") {
    return redirect("/access-denied")
  }

  return orgData
}
