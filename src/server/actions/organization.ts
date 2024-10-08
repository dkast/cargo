"use server"

import { MembershipRole, Prisma } from "@prisma/client"
import * as argon2 from "argon2"
import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"

import { prisma } from "@/server/db"
import { authActionClient } from "@/lib/safe-actions"
import { orgSchema, userMemberSchema } from "@/lib/types"

export const createOrg = authActionClient
  .schema(orgSchema)
  .action(
    async ({ parsedInput: { name, description, subdomain, status, plan } }) => {
      // Create organization
      try {
        const org = await prisma.organization.create({
          data: {
            name: name,
            description: description,
            subdomain: subdomain,
            status: status,
            plan: plan
          }
        })

        await prisma.user.update({
          where: {
            email: "devcastillejo@gmail.com"
          },
          data: {
            memberships: {
              create: [
                {
                  role: MembershipRole.ADMIN,
                  organizationId: org.id
                }
              ]
            }
          }
        })

        revalidateTag("organizations")
        revalidateTag(`organization-${org.id}`)
        revalidateTag(`organization-${subdomain}`)

        return {
          success: true
        }
      } catch (error) {
        let message
        if (typeof error === "string") {
          message = error
        } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            message = "Subdominio ya existe"
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

export const updateOrg = authActionClient
  .schema(orgSchema)
  .action(
    async ({
      parsedInput: { id, name, description, subdomain, status, plan }
    }) => {
      // Update organization
      try {
        await prisma.organization.update({
          where: {
            id: id
          },
          data: {
            name: name,
            description: description,
            subdomain: subdomain,
            status: status,
            plan: plan
          }
        })

        revalidateTag("organizations")
        revalidateTag(`organization-${id}`)
        revalidateTag(`organization-${subdomain}`)

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

export const createOrgMember = authActionClient
  .schema(userMemberSchema)
  .action(
    async ({
      parsedInput: {
        organizationId,
        name,
        email,
        username,
        password,
        role,
        timezone
      }
    }) => {
      // Create member
      try {
        await prisma.user.create({
          data: {
            name: name,
            email: email,
            username: username,
            password: await argon2.hash(password),
            timezone: timezone,
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
            message = "Correo electrónico ya existe con otra cuenta"
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

export const updateOrgMember = authActionClient
  .schema(userMemberSchema)
  .action(
    async ({
      parsedInput: {
        id,
        name,
        password,
        email,
        role,
        isActive,
        defaultMembershipId,
        timezone
      }
    }) => {
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
                defaultMembershipId: defaultMembershipId,
                timezone: timezone
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
              password: await argon2.hash(password)
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

export const deactivateOrgMember = authActionClient
  .schema(userMemberSchema)
  .action(async ({ parsedInput: { id, isActive } }) => {
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
  })

export const deleteOrganization = authActionClient
  .schema(
    z.object({
      id: z.string().cuid()
    })
  )
  .action(async ({ parsedInput: { id } }) => {
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
