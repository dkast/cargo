import Balancer from "react-wrap-balancer"
import Link from "next/link"

import DotPattern from "@/components/landing/dot-pattern"
import Waitlist from "@/components/landing/waitlist"
import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col items-center">
      <NavBar />
      <Hero />
    </div>
  )
}

function NavBar() {
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

function Hero() {
  return (
    <section className="flex max-w-4xl flex-col gap-y-10 px-3 text-center">
      <DotPattern
        className={cn(
          "fill-gray-400/60 [mask-image:radial-gradient(700px_circle_at_center,white,transparent)]"
        )}
      />
      <Balancer>
        <h1 className="relative mt-32 bg-gradient-to-tr from-gray-800 via-gray-700 to-brand-500 bg-clip-text font-display text-4xl font-medium tracking-tight text-transparent sm:text-6xl">
          Simplifica tus procesos de C-TPAT
        </h1>
      </Balancer>
      <p className="text-gray-800 sm:text-lg">
        <Balancer>
          Cargo es una aplicación que te facilita la gestión de tus formatos
          CTPAT desde cualquier dispositivo. Ahorra tiempo y reduce el estrés
          con nuestro sistema de control de documentos.
        </Balancer>
      </p>
      <div className="relative my-10">
        <Waitlist />
      </div>
    </section>
  )
}
