"use server"

import { revalidateTag } from "next/cache"
import { z } from "zod"

import { prisma } from "@/server/db"
import { action } from "@/lib/safe-actions"
import { locationSchema } from "@/lib/types"

export const createLocation = action
  .schema(locationSchema)
  .action(async ({ parsedInput: { name, description, organizationId } }) => {
    // Create location
    try {
      await prisma.location.create({
        data: {
          name: name,
          description: description,
          organizationId: organizationId
        }
      })

      revalidateTag(`locations-${organizationId}-onlyActive-${false}`)

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
  })

export const updateLocation = action
  .schema(locationSchema)
  .action(
    async ({
      parsedInput: { id, name, description, isActive, organizationId }
    }) => {
      // Update location
      try {
        await prisma.location.update({
          where: {
            id: id
          },
          data: {
            name: name,
            description: description,
            isActive: isActive
          }
        })

        revalidateTag(`locations-${organizationId}-onlyActive-${false}`)

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

export const deleteLocation = action
  .schema(
    z.object({
      id: z.string().cuid(),
      organizationId: z.string().cuid()
    })
  )
  .action(
    // Delete location only if it has no inspections
    async ({ parsedInput: { id, organizationId } }) => {
      try {
        const location = await prisma.location.findUnique({
          where: {
            id: id,
            inspections: {
              none: {}
            }
          }
        })

        if (location) {
          await prisma.location.delete({
            where: {
              id: id
            }
          })

          revalidateTag(`locations-${organizationId}-onlyActive-${false}`)

          return {
            success: true
          }
        } else {
          return {
            failure: {
              reason: "La ubicación tiene inspecciones asociadas"
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
