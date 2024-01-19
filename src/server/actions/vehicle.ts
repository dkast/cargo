"use server"

import { Prisma } from "@prisma/client"
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
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          message = "Ya existe un vehículo con ese número de placas"
        } else {
          message = error.message
        }
      }
      return {
        failure: {
          reason: message
        }
      }
    }
  }
)

export const updateVehicle = action(
  vehicleSchema,
  async ({ id, vehicleNbr, licensePlate, organizationId }) => {
    // Update vehicle
    try {
      await prisma.vehicle.update({
        where: {
          id: id
        },
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
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          message = "Ya existe un vehículo con ese número de placas"
        } else {
          message = error.message
        }
      }
      return {
        failure: {
          reason: message
        }
      }
    }
  }
)

// Delete only if there are no inspections using this vehicle
export const deleteVehicle = action(
  vehicleSchema,
  async ({ id, organizationId }) => {
    // Delete vehicle
    try {
      const vehicle = await prisma.vehicle.findUnique({
        where: {
          id: id,
          inspections: {
            none: {}
          }
        }
      })

      if (vehicle) {
        await prisma.vehicle.delete({
          where: {
            id: id
          }
        })

        revalidateTag(`vehicles-${organizationId}`)

        return {
          success: true
        }
      } else {
        return {
          failure: {
            reason: "La Unidad tiene inspecciones asociadas"
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
