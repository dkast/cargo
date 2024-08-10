import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { revalidateTag } from "next/cache"
import { NextResponse, type NextRequest } from "next/server"

import { prisma } from "@/server/db"
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

export async function POST(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { organizationId, filename, fileHash, contentType } = await req.json()

  // Create a signed URL for a PUT request
  const signedUrl = await getSignedUrl(
    R2,
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: `orgId_${organizationId}/${fileHash}/${filename}`,
      ContentType: contentType as string
    }),
    { expiresIn: 3600 }
  )

  // Save image url to database so we can retrieve it later
  await prisma.organization.update({
    where: {
      id: organizationId
    },
    data: {
      image: `orgId_${organizationId}/${fileHash}/${filename}`
    }
  })

  // revalidatePath("/dashboard/settings")
  revalidateTag(`organization-${organizationId}`)

  // Return the signed URL to the client for a PUT request
  // @see https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/#generate-presigned-urls
  return NextResponse.json(
    { url: signedUrl, method: "PUT" },
    {
      headers: {
        "Access-Control-Allow-Origin": "*" // Required for CORS support to work
      }
    }
  )
}

/**
 * Retrieve a list of signed URLs for a GET request
 * @see https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/#generate-presigned-urls
 */
export async function GET(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const searchParams = req.nextUrl.searchParams
  const subdomain = searchParams.get("subdomain")

  if (!subdomain) {
    return new Response("Missing subdomain", {
      status: 400
    })
  }

  const organization = await prisma.organization.findUnique({
    where: {
      subdomain: subdomain
    },
    select: {
      name: true,
      image: true
    }
  })

  let signedUrl = null
  if (organization?.image) {
    signedUrl = await getSignedUrl(
      R2,
      new GetObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: organization?.image
      }),
      { expiresIn: 3600 }
    )
  }

  return Response.json({
    organizationName: organization?.name,
    imageURL: signedUrl
  })
}
