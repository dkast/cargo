"use server"

import {
  InspectionItemResult,
  InspectionStatus,
  InspectionType
} from "@prisma/client"
import { revalidateTag } from "next/cache"

import { prisma } from "@/server/db"
import { action } from "@/lib/safe-actions"
import { ctpatInspections, ctpatMainSchema } from "@/lib/types"

export const createCTPATInspection = action(
  ctpatMainSchema,
  async ({
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
