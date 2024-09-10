import PageHeader from "@/components/dashboard/page-header"
import SecondaryNav from "@/components/dashboard/secondary-nav"

const SecondaryNavItems = [
  {
    title: "General",
    href: "/admin"
  }
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader
        title="Administración"
        description="Administra los ajustes de las organizaciones, miembros del equipo y otros datos"
      />
      <SecondaryNav items={SecondaryNavItems} />
      <div className="flex grow pb-4">{children}</div>
    </>
  )
}
