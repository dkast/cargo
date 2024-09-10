"use server"

import { z } from "zod"

import { prisma } from "@/server/db"
import { actionClient } from "@/lib/safe-actions"

export const joinWaitlist = actionClient
  .schema(
    z.object({
      email: z.string().email()
    })
  )
  .action(async ({ parsedInput: { email } }) => {
    try {
      const waitlist = await prisma.waitlist.findUnique({
        where: {
          email: email
        }
      })

      if (waitlist) {
        throw new Error("Ya estás en la lista de espera")
      }

      await prisma.waitlist.create({
        data: {
          email: email
        }
      })

      return {
        success: {
          email: email
        }
      }
    } catch (error) {
      let message
      if (typeof error === "string") {
        message = error
      } else if (error instanceof Error) {
        message = error.message
      } else {
        message = "Unknown error"
      }
      return {
        failure: {
          reason: message
        }
      }
    }
  })
