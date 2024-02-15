import Link from "next/link"

import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"

export function NavBar() {
  return (
    <nav className="flex w-full max-w-4xl items-center justify-between px-4 py-8 sm:px-0">
      <div>
        <Link href="/" className="flex items-center justify-center gap-x-2">
          <Logo className="h-8 w-auto" />
          <h1 className="font-display text-3xl font-medium tracking-tight">
            cargo
          </h1>
        </Link>
      </div>
      <div>
        <Button variant="outline" className="rounded-full" asChild>
          <Link href="/login">Iniciar sesión</Link>
        </Button>
      </div>
    </nav>
  )
}
