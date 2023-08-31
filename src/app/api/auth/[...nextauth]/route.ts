import NextAuth from "next-auth/next"
import type { NextRequest } from "next/server"

import { authOptions } from "@/server/auth"

const handler = (_req: NextRequest) => NextAuth(authOptions)

export { handler as GET, handler as POST }
