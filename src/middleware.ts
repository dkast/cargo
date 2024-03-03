export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/:domain/dashboard/:path*", "/:domain/ctpat/:id/pdf"]
}
