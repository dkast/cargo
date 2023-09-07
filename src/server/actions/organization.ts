"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/server/db"
import { action } from "@/lib/safe-actions"
import { orgSchema } from "@/lib/types"

export const updateOrganization = action(
  orgSchema,
  async ({ id, name, description, subdomain }) => {
    // Update organization
    try {
      await prisma.organization.update({
        where: {
          id: id
        },
        data: {
          name: name,
          description: description,
          subdomain: subdomain
        }
      })

      revalidatePath("/dashboard/settings")

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
