"use server"

import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { z } from "zod"

import { prisma } from "@/server/db"
import { action } from "@/lib/safe-actions"
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

export const deleteFile = action(
  z.object({
    id: z.string().cuid()
  }),
  async ({ id }) => {
    try {
      const file = await prisma.inspectionItemFile.findFirst({
        where: {
          id: id
        }
      })

      if (!file) {
        throw new Error("File not found")
      }

      // Delete file from R2
      await R2.send(
        new DeleteObjectCommand({
          Bucket: env.R2_BUCKET_NAME,
          Key: file.fileUrl
        })
      )

      // Delete file from database
      await prisma.inspectionItemFile.delete({
        where: {
          id: id
        }
      })
      return {
        success: {
          fileId: id
        }
      }
    } catch (error) {
      let message
      if (typeof error === "string") {
        message = error
      } else if (error instanceof Error) {
        message = error.message
      }
      return {
        failure: {
          reason: message
        }
      }
    }
  }
)
