import ProfileMenu from "@/app/[domain]/dashboard/profile-menu"

import PageHeader from "@/components/dashboard/page-header"
import SecondarySidebar from "@/components/dashboard/secondary-sidebar"

const SecondaryNavItems = [
  {
    title: "General",
    children: [
      {
        title: "Organizaciones",
        href: "/admin"
      },
      {
        title: "Lista de Espera",
        href: "/admin/waitlist"
      }
    ]
  }
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader
        title="Administración"
        description="Administra los ajustes de las organizaciones, miembros del equipo y otros datos"
      >
        <ProfileMenu />
      </PageHeader>
      <div className="flex grow flex-row">
        <SecondarySidebar items={SecondaryNavItems} />
        <div className="flex grow pb-4">{children}</div>
      </div>
    </>
  )
}
