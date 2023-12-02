"use server"

import { Prisma } from "@prisma/client"
import { revalidateTag } from "next/cache"

import { prisma } from "@/server/db"
import { action } from "@/lib/safe-actions"
import { operatorSchema } from "@/lib/types"

export const createOperator = action(
  operatorSchema,
  async ({ name, licenseNumber, organizationId }) => {
    // Create operator
    try {
      await prisma.operator.create({
        data: {
          name: name,
          licenseNumber: licenseNumber,
          organizationId: organizationId
        }
      })

      revalidateTag(`operators-${organizationId}`)

      return {
        success: true
      }
    } catch (error) {
      let message
      if (typeof error === "string") {
        message = error
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          message = "Ya existe un operador con ese número de licencia"
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
