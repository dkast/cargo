"use server"

import { Prisma } from "@prisma/client"
import { revalidateTag } from "next/cache"

import { prisma } from "@/server/db"
import { authActionClient } from "@/lib/safe-actions"
import { operatorSchema } from "@/lib/types"

export const createOperator = authActionClient
  .schema(operatorSchema)
  .action(async ({ parsedInput: { name, licenseNumber, organizationId } }) => {
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
  })

export const updateOperator = authActionClient
  .schema(operatorSchema)
  .action(
    async ({ parsedInput: { id, name, licenseNumber, organizationId } }) => {
      // Update operator
      try {
        await prisma.operator.update({
          where: {
            id: id
          },
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

// Delete only if there are no inspections using this operator
export const deleteOperator = authActionClient
  .schema(operatorSchema)
  .action(async ({ parsedInput: { id, organizationId } }) => {
    // Delete operator
    try {
      const operator = await prisma.operator.findUnique({
        where: {
          id: id,
          inspections: {
            none: {}
          }
        }
      })

      if (operator) {
        await prisma.operator.delete({
          where: {
            id: id
          }
        })

        revalidateTag(`operators-${organizationId}`)

        return {
          success: true
        }
      } else {
        return {
          failure: {
            reason: "El operador tiene inspecciones asociadas"
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
  })
