import PageHeader from "@/components/dashboard/page-header"
import SecondaryNav from "@/components/dashboard/secondary-nav"

const SecondaryNavItems = [
  {
    title: "General",
    href: "/dashboard/settings"
  },
  {
    title: "Miembros",
    href: "/dashboard/settings/members"
  },
  {
    title: "Transportistas",
    href: "/dashboard/settings/transports"
  },
  {
    title: "Operadores",
    href: "/dashboard/settings/drivers"
  },
  {
    title: "Unidades",
    href: "/dashboard/settings/vehicles"
  },
  {
    title: "Contenedores",
    href: "/dashboard/settings/containers"
  }
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader
        title="Configuración"
        description="Maneja los ajustes de la organización, miembros del equipo y otros datos"
      />
      <SecondaryNav items={SecondaryNavItems} />
      <div className="flex grow">{children}</div>
    </>
  )
}
