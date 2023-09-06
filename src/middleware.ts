import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  async function middleware(req) {
    console.log(req)
    const token = await getToken({ req })
    const isAuth = !!token

    if (req.nextUrl.pathname === "/login") {
      if (isAuth) {
        return NextResponse.redirect(new URL(`/dashboard`, req.url))
      }
      return null
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL(`/login`, req.url))
    }
  },
  {
    callbacks: {
      authorized() {
        return true
      }
    }
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/login"]
}
