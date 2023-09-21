"use server"

import { revalidateTag } from "next/cache"

import { prisma } from "@/server/db"
import { action } from "@/lib/safe-actions"
import { companySchema } from "@/lib/types"

export const createCompany = action(
  companySchema,
  async ({ name, organizationId }) => {
    // Create company
    try {
      await prisma.company.create({
        data: {
          name: name,
          organizationId: organizationId
        }
      })

      revalidateTag(`companies-${organizationId}`)

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
