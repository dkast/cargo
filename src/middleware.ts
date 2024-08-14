// export { default } from "next-auth/middleware"
import NextAuth from "next-auth"

import authConfig from "@/lib/auth.config"

const { auth: middleware } = NextAuth(authConfig)

export default middleware(req => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  if (!isLoggedIn) {
    let callbackUrl = nextUrl.pathname
    if (nextUrl.search) {
      callbackUrl += nextUrl.search
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl)

    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    )
  }
})

export const config = {
  matcher: ["/:domain/dashboard/:path*", "/:domain/ctpat/:id/pdf"]
}
