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

export const updateContainer = action(
  containerSchema,
  async ({ id, containerNbr, organizationId }) => {
    // Update container
    try {
      await prisma.container.update({
        where: {
          id: id
        },
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

// Delete only if there are no inspections using this container
export const deleteContainer = action(
  containerSchema,
  async ({ id, organizationId }) => {
    // Delete container
    try {
      const container = await prisma.container.findUnique({
        where: {
          id: id,
          inspections: {
            none: {}
          }
        }
      })

      if (container) {
        await prisma.container.delete({
          where: {
            id: id
          }
        })

        revalidateTag(`containers-${organizationId}`)

        return {
          success: true
        }
      } else {
        return {
          failure: {
            reason: "El contenedor tiene inspecciones asociadas"
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
