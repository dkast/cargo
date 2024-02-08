import Balancer from "react-wrap-balancer"
import {
  ClipboardCheck,
  CloudCog,
  FileBarChart,
  FolderSearch,
  LinkIcon,
  Share
} from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { BentoCard, BentoGrid } from "@/components/landing/bento-grid"
import { BorderBeam } from "@/components/landing/border-beam"
import ChartDemo from "@/components/landing/chart-demo"
import DotPattern from "@/components/landing/dot-pattern"
import Globe from "@/components/landing/globe"
import ListDemo from "@/components/landing/list-demo"
import Waitlist from "@/components/landing/waitlist"
import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Cargo - Aplicación para inspecciones C-TPAT",
  description:
    "Realiza inspecciones C-TPAT desde cualquir dispositivo. Registra incidentes, anexa evidencia fotográfica y genera reportes en segundos."
}

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col items-center">
      <NavBar />
      <Hero />
      <Display />
      <Features />
      <Footer />
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
    <section className="relative flex max-w-4xl flex-col items-center gap-y-10 px-3 text-center sm:static">
      <DotPattern
        className={cn(
          "fill-gray-400/60 [mask-image:radial-gradient(400px_circle_at_center,white,transparent)] sm:[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]"
        )}
      />
      <Balancer>
        <h1 className="relative mt-24 bg-gradient-to-br from-gray-800 via-gray-700 to-brand-500 bg-clip-text font-display text-5xl font-medium tracking-tight text-transparent sm:mt-32 sm:bg-gradient-to-tr sm:text-6xl sm:leading-normal">
          Agiliza tus inspecciones C-TPAT
        </h1>
      </Balancer>
      <p className="text-gray-600 sm:text-xl">
        <Balancer>
          Realiza inspecciones C-TPAT desde cualquir dispositvo. Registra
          incidentes, anexa evidencia fotográfica y genera reportes en segundos.
        </Balancer>
      </p>
      <div className="relative my-10">
        <Waitlist />
      </div>
    </section>
  )
}

function Display() {
  return (
    <section className="my-10">
      <div className="relative rounded-lg px-4 sm:rounded-xl sm:px-0">
        <img
          src="dashboard.png"
          alt="Hero Image"
          className="w-[1024px] rounded-[inherit] border object-contain shadow-lg"
        />
        <BorderBeam
          size={250}
          duration={12}
          delay={9}
          className="invisible sm:visible"
        />
      </div>
    </section>
  )
}

const features = [
  {
    Icon: ClipboardCheck,
    name: "Inspecciones",
    description:
      "Realiza inspecciones de los 17 puntos desde un dispositivo móvil. Guarda evidencia fotográfica y notas.",
    href: "/",
    cta: "Ver más",
    background: (
      <ListDemo className="absolute right-0 top-0 origin-top transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_80%,#000_100%)] group-hover:scale-105 sm:[mask-image:linear-gradient(to_top,transparent_60%,#000_100%)]" />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3"
  },
  {
    Icon: FolderSearch,
    name: "Historial y búsqueda",
    description:
      "Busca y filtra tus inspecciones por diferentes criterios. Toda tu información se almacena de forma segura en la nube.",
    href: "/",
    cta: "Ver más",
    background: (
      <img
        src="query.png"
        alt="Search"
        className="absolute right-0 top-[-136px] w-[300px] transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_60%)] group-hover:translate-x-10 sm:top-[-132px]"
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-4"
  },
  {
    Icon: LinkIcon,
    name: "Comparte y colabora",
    description:
      "Genera reportes en PDF y enlaces que puedes compartir dentro o fuera de tu organización.",
    href: undefined,
    cta: "Ver más",
    background: (
      <div className="absolute inset-0 top-32 flex items-start justify-center transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_20%,#000_80%)] group-hover:-translate-y-10 group-hover:scale-105">
        <Button
          size="lg"
          className="gap-x-3 rounded-full bg-brand-500 shadow-lg shadow-brand-500/30 hover:bg-brand-400 active:bg-brand-600 sm:hidden"
        >
          <Share className="size-4" />
          Compartir
        </Button>
      </div>
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2"
  },
  {
    Icon: FileBarChart,
    name: "Informes y Analítica",
    description:
      "Obtén información relevante sobre tus inspecciones. Descubre tendencias y áreas de oportunidad.",
    href: undefined,
    cta: "Ver más",
    background: (
      <ChartDemo className="absolute left-10 top-5 w-[300px] origin-top translate-x-0 transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:-translate-x-10"></ChartDemo>
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-3"
  },
  {
    Icon: CloudCog,
    name: "Implementación rápida",
    description:
      "Sin instalaciones, accesible desde cualquier sitio en tu navegador.",
    href: undefined,
    cta: "Ver más",
    background: (
      <Globe className="-top-20 h-[600px] w-[600px] transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105 sm:left-10" />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-3 lg:row-end-4"
  }
]

function Features() {
  return (
    <section className="mt-20 flex flex-col items-center gap-y-4 px-4 sm:px-0">
      <h2 className="text-4xl font-semibold tracking-tight text-gray-800">
        Funcionalidades
      </h2>
      <p className="max-w-4xl text-center text-gray-600 sm:text-lg">
        <Balancer>
          Descubre como Cargo puede ayudarte a llevar tus inspecciones C-TPAT de
          forma más eficiente.
        </Balancer>
      </p>
      <div className="mt-10 max-w-4xl px-4 sm:px-0">
        <BentoGrid className="lg:grid-rows-3">
          {features.map(feature => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="mt-10 flex flex-col items-center justify-center gap-y-2 py-6 text-sm">
      <p className="text-gray-600">
        &copy; {new Date().getFullYear()} Cargo. Todos los derechos reservados.
      </p>
      <div className="flex gap-x-4">
        <Link href="/terms" className="text-gray-600">
          Términos de uso
        </Link>
        <Link href="/privacy" className="text-gray-600">
          Política de privacidad
        </Link>
      </div>
    </footer>
  )
}
