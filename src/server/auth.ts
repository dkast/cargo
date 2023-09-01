import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { hash } from "bcrypt"
import { type GetServerSidePropsContext } from "next"
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions
} from "next-auth"
import Credentials from "next-auth/providers/credentials"
import DiscordProvider from "next-auth/providers/discord"

import { prisma } from "@/server/db"
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
      // role: UserRole;
    }
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id
      }
    })
  },
  adapter: PrismaAdapter(prisma),
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
        // const user = await prisma.user.findFirst({
        //   where: {
        //     username: username,
        //     password: await hash(password, 12)
        //   }
        // })

        // Test
        const user = { id: "1", username: "admin" }

        if (user) {
          return user
        } else {
          return null
        }
      }
    })
  ],
  secret: env.NEXTAUTH_SECRET
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"]
  res: GetServerSidePropsContext["res"]
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions)
}
