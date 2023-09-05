import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// export default withAuth(
//   async function middleware(req) {
//     const token = await getToken({ req })
//     const isAuth = !!token

//     console.log(token)
//     if (req.nextUrl.pathname === "/login") {
//       if (isAuth) {
//         return NextResponse.redirect(new URL(`/dashboard`, req.url))
//       }
//       return null
//     }

//     if (!isAuth) {
//       return NextResponse.redirect(new URL(`/login`, req.url))
//     }
//   },
//   {
//     callbacks: {
//       authorized() {
//         return true
//       }
//     }
//   }
// )

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      console.log(token)
      // matcher array will be only requires the user to be logged in
      return !!token
    }
  }
})

export const config = {
  matcher: ["/dashboard/:path*"]
}
