"use server"

import { revalidateTag } from "next/cache"

import { prisma } from "@/server/db"
import { action } from "@/lib/safe-actions"
import { vehicleSchema } from "@/lib/types"

export const createVehicle = action(
  vehicleSchema,
  async ({ vehicleNbr, licensePlate, organizationId }) => {
    // Create vehicle
    try {
      await prisma.vehicle.create({
        data: {
          vehicleNbr: vehicleNbr,
          licensePlate: licensePlate,
          organizationId: organizationId
        }
      })

      revalidateTag(`vehicles-${organizationId}`)

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
