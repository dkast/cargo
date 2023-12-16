"use server"

import {
  InspectionItemResult,
  InspectionResult,
  InspectionStatus,
  InspectionType
} from "@prisma/client"
import { revalidateTag } from "next/cache"
import { z } from "zod"

import { prisma } from "@/server/db"
import { action } from "@/lib/safe-actions"
import {
  ctpatInspections,
  ctpatMainSchema,
  inspectionDetailSchema
} from "@/lib/types"

export const createCTPATInspection = action(
  ctpatMainSchema,
  async ({
    locationId,
    companyId,
    operatorId,
    licenseNumber,
    vehicleId,
    licensePlate,
    containerId,
    isLoaded,
    start,
    tripType,
    inspectedById,
    organizationId
  }) => {
    // Create CTPAT Inspection
    try {
      const inspection = await prisma.inspection.create({
        data: {
          locationId: locationId,
          companyId: companyId,
          operatorId: operatorId,
          licenseNumber: licenseNumber,
          vehicleId: vehicleId,
          licensePlate: licensePlate,
          containerId: containerId,
          isLoaded: isLoaded,
          start: start,
          inspectionType: InspectionType.CTPAT,
          tripType: tripType,
          inspectedById: inspectedById,
          organizationId: organizationId,
          status: InspectionStatus.OPEN,
          inspectionItems: {
            create: ctpatInspections.map((item, index) => ({
              question: item,
              result: InspectionItemResult.NA,
              order: index,
              organization: { connect: { id: organizationId } }
            }))
          }
        }
      })

      revalidateTag(`ctpatInspections-${organizationId}`)

      return {
        success: {
          inspectionId: inspection.id
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

export const closeCTPATInspection = action(
  inspectionDetailSchema,
  async ({
    id,
    items,
    sealNbr,
    tiresVehicle,
    tiresContainer,
    organizationId
  }) => {
    // If one of the items is FAIL, then the inspection is FAIL
    const failure = items.some(item => item.result === "FAIL")

    try {
      const inspection = await prisma.inspection.update({
        where: {
          id: id
        },
        data: {
          result: failure ? InspectionResult.FAIL : InspectionResult.PASS,
          sealNbr: sealNbr,
          tiresVehicle: tiresVehicle,
          tiresContainer: tiresContainer,
          inspectionItems: {
            updateMany: items.map(item => ({
              where: {
                id: item.id
              },
              data: {
                result: item.result,
                notes: item.notes
              }
            }))
          },
          status: InspectionStatus.CLOSED,
          end: new Date()
        }
      })

      revalidateTag(`ctpatInspections-${organizationId}`)

      return {
        success: {
          inspectionId: inspection.id
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

export const deleteCTPATInspection = action(
  z.object({
    id: z.string().cuid(),
    organizationId: z.string().cuid()
  }),
  async ({ id, organizationId }) => {
    try {
      await prisma.inspection.delete({
        where: {
          id: id
        }
      })

      revalidateTag(`ctpatInspections-${organizationId}`)

      return {
        success: {
          inspectionId: id
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

export const approveCTPATInspection = action(
  z.object({
    id: z.string().cuid(),
    organizationId: z.string().cuid(),
    approvedById: z.string().cuid()
  }),
  async ({ id, organizationId, approvedById }) => {
    try {
      await prisma.inspection.update({
        where: {
          id: id
        },
        data: {
          status: InspectionStatus.APPROVED,
          approvedById: approvedById
        }
      })

      revalidateTag(`ctpatInspections-${organizationId}`)

      return {
        success: {
          inspectionId: id
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
