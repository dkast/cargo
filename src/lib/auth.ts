import { PrismaAdapter } from "@auth/prisma-adapter"
import { type MembershipRole } from "@prisma/client"
import * as argon2 from "argon2"
import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { unstable_cache } from "next/cache"

import { prisma } from "@/server/db"
import authConfig from "@/lib/auth.config"
import { env } from "@/env.mjs"

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string
      // ...other properties
      username: string
      role: MembershipRole
      membershipId: string
      // default organization
      organizationId: string
      organizationDomain: string
    }
  }

  interface User {
    // ...other properties
    defaultMembershipId: string | null
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          membershipId: user.defaultMembershipId
        }
      }
      return token
    },
    session: async ({ session, token }) => {
      const membershipData = await unstable_cache(
        async () => {
          //@ts-expect-error user assigned in jwt callback
          if (token.user.membershipId) {
            return await prisma.membership.findFirst({
              where: {
                //@ts-expect-error user assigned in jwt callback
                id: token.user.membershipId
              },
              include: {
                organization: true
              }
            })
          } else {
            return await prisma.membership.findFirst({
              where: {
                //@ts-expect-error user assigned in jwt callback
                userId: token.user.id
              },
              include: {
                organization: true
              }
            })
          }
        },
        //@ts-expect-error user assigned in jwt callback
        [`membership-${token.user.id}`],
        {
          revalidate: 900,
          //@ts-expect-error user assigned in jwt callback
          tags: [`membership-${token.user.id}`]
        }
      )()
      //@ts-expect-error user assigned in jwt callback
      session.user = token.user
      //@ts-expect-error assign membershipId
      session.user.membershipId = membershipData?.id
      //@ts-expect-error assign role
      session.user.role = membershipData?.role
      //@ts-expect-error assign organizationId
      session.user.organizationId = membershipData?.organizationId
      //@ts-expect-error assign organization name
      session.user.organizationDomain = membershipData?.organization?.subdomain
      return session
    }
  },
  pages: {
    signIn: "/login"
  },
  secret: env.NEXTAUTH_SECRET,
  ...authConfig,
  providers: [
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET
    // }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
    Credentials({
      name: "Credentials",
      credentials: {
        username: {
          label: "Usuario",
          type: "text",
          placeholder: "Usuario"
        },
        password: {
          label: "Contraseña",
          type: "password"
        }
      },
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string
          password: string
        }
        const user = await prisma.user.findUnique({
          where: {
            username: username
          }
        })

        if (user?.password) {
          const passwordMatch = await argon2.verify(user.password, password)

          if (passwordMatch) {
            return user
          } else {
            return null
          }
        } else {
          return null
        }
      }
    })
  ]
})
