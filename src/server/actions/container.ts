"use server"

import { revalidateTag } from "next/cache"

import { prisma } from "@/server/db"
import { action } from "@/lib/safe-actions"
import { containerSchema } from "@/lib/types"

export const createContainer = action(
  containerSchema,
  async ({ containerNbr, organizationId }) => {
    // Create container
    try {
      await prisma.container.create({
        data: {
          containerNbr: containerNbr,
          organizationId: organizationId
        }
      })

      revalidateTag(`containers-${organizationId}`)

      return {
        success: true
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
