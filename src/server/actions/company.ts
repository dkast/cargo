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

export const updateCompany = action(
  companySchema,
  async ({ id, name, organizationId }) => {
    // Update company
    try {
      await prisma.company.update({
        where: {
          id: id
        },
        data: {
          name: name
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

// Delete only if there are no inspections using this company
export const deleteCompany = action(
  companySchema,
  async ({ id, organizationId }) => {
    // Delete company
    try {
      const company = await prisma.company.findFirst({
        where: {
          id: id,
          inspections: {
            none: {}
          }
        }
      })

      if (company) {
        await prisma.company.delete({
          where: {
            id: id
          }
        })

        revalidateTag(`companies-${organizationId}`)

        return {
          success: true
        }
      } else {
        return {
          failure: {
            reason: "El transportista tiene inspecciones asociadas"
          }
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
