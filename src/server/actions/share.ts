"use server"

import { nanoid } from "nanoid"

import { prisma } from "@/server/db"
import { action } from "@/lib/safe-actions"
import { ShareFormSchema } from "@/lib/types"

export const createShareItem = action(
  ShareFormSchema,
  async ({ sharePath, password, expiresAt, organizationId }) => {
    try {
      const shareItem = await prisma.shareItem.create({
        data: {
          sharePath: sharePath,
          password: password ?? undefined,
          expiresAt: expiresAt ?? undefined,
          organizationId: organizationId,
          nanoid: nanoid(10)
        }
      })
      return {
        success: {
          shareItem: shareItem
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
