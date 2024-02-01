"use server"

import { nanoid } from "nanoid"

import { prisma } from "@/server/db"
import { action } from "@/lib/safe-actions"
import { ShareFormSchema } from "@/lib/types"
import { getBaseUrl } from "@/lib/utils"

export const createShareItem = action(
  ShareFormSchema,
  async ({ accessType, sharePath, password, expiresAt, organizationId }) => {
    try {
      const shareItem = await prisma.shareItem.create({
        data: {
          accessType: accessType,
          sharePath: sharePath,
          password: password ?? undefined,
          expiresAt: expiresAt ?? undefined,
          organizationId: organizationId,
          nanoid: nanoid(8)
        }
      })
      return {
        success: {
          shareURL: getBaseUrl() + `/share/${shareItem.nanoid}`
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
