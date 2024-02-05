"use server"

import { hash } from "bcrypt"
import { revalidatePath, revalidateTag } from "next/cache"

import { prisma } from "@/server/db"
import { action } from "@/lib/safe-actions"
import { orgSchema, userMemberSchema } from "@/lib/types"

export const updateOrg = action(
  orgSchema,
  async ({ id, name, description, subdomain }) => {
    // Update organization
    try {
      await prisma.organization.update({
        where: {
          id: id
        },
        data: {
          name: name,
          description: description,
          subdomain: subdomain
        }
      })

      revalidatePath("/dashboard/settings")

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

export const createOrgMember = action(
  userMemberSchema,
  async ({ organizationId, name, email, username, password, role }) => {
    // Create member
    try {
      await prisma.user.create({
        data: {
          name: name,
          email: email,
          username: username,
          password: await hash(password, 12),
          memberships: {
            create: [
              {
                role: role,
                organizationId: organizationId
              }
            ]
          }
        }
      })

      revalidatePath("/dashboard/settings/members")

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

export const updateOrgMember = action(
  userMemberSchema,
  async ({ id, name, email, username, password, role, isActive }) => {
    // Update member
    try {
      const membership = await prisma.membership.update({
        where: {
          id: id
        },
        data: {
          role: role,
          isActive: isActive,
          user: {
            update: {
              name: name,
              email: email,
              username: username
            }
          }
        }
      })

      if (password !== "password") {
        await prisma.user.update({
          where: {
            id: membership.userId
          },
          data: {
            password: await hash(password, 12)
          }
        })
      }

      revalidateTag(`member-${membership.id}`)
      revalidateTag(`members-${membership.organizationId}`)

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

export const deactivateOrgMember = action(
  userMemberSchema,
  async ({ id, isActive }) => {
    // Deactivate member
    try {
      await prisma.membership.update({
        where: {
          id: id
        },
        data: {
          isActive: isActive
        }
      })

      revalidateTag(`member-${id}`)

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
