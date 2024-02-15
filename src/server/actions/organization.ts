"use server"

import { Prisma } from "@prisma/client"
import { hash } from "bcrypt"
import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"

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

      revalidateTag(`organization-${id}`)

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
      await prisma.user.upsert({
        where: {
          email: email
        },
        update: {
          name: name,
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
        },
        create: {
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

      revalidateTag(`members-${organizationId}`)

      return {
        success: true
      }
    } catch (error) {
      let message
      if (typeof error === "string") {
        message = error
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          message = "Nombre de usuario o correo electrónico ya existe"
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

export const updateOrgMember = action(
  userMemberSchema,
  async ({ id, name, password, role, isActive, defaultMembershipId }) => {
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
              defaultMembershipId: defaultMembershipId
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
      revalidateTag(`membership-${membership.userId}`)
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

export const deleteOrganization = action(z.string().cuid(), async id => {
  // Delete organization
  try {
    await prisma.organization.delete({
      where: {
        id: id
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
})
