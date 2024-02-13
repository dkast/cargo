import { Footer } from "@/components/landing/footer"
import { NavBar } from "@/components/landing/navbar"

export default function LayoutMarketing({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col items-center">
      <NavBar />
      <div className="max-w-4xl px-4 sm:px-0">{children}</div>
      <Footer />
    </div>
  )
}
