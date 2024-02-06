import Link from "next/link"

import Waitlist from "@/components/landing/waitlist"
import Logo from "@/components/logo"

export default function HomePage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-gray-950 bg-[url(/bg-landing.svg)] 
      bg-cover bg-center bg-no-repeat"
    >
      <div className="fixed right-4 top-4 text-white hover:underline">
        <Link href="/login">Iniciar sesión</Link>
      </div>
      <div className="flex flex-col">
        <div className="mb-10 flex items-center justify-center gap-x-4 text-white">
          <Logo className="h-10 w-auto fill-white" />
          <h1 className="font-display text-3xl font-medium tracking-tight sm:text-5xl">
            cargo
          </h1>
        </div>
        <section className="flex max-w-4xl flex-col gap-y-10 px-3 text-center">
          <h1 className="font-display text-4xl font-medium tracking-tight text-orange-500 sm:text-5xl">
            Simplifica tus procesos de C-TPAT
          </h1>
          <p className="text-gray-400 sm:text-lg">
            <span className=" text-white">Cargo</span> es una aplicación que te
            facilita la gestión de tus formatos CTPAT desde cualquier
            dispositivo. Ahorra tiempo y reduce el estrés con nuestro sistema de
            control de documentos.
          </p>
        </section>
        <section className="mt-10">
          <Waitlist />
        </section>
      </div>
    </div>
  )
}
