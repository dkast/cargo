import PageHeader from "@/components/dashboard/page-header"
import SecondaryNav from "@/components/dashboard/secondary-nav"

const SecondaryNavItems = [
  {
    title: "CTPAT",
    href: "/dashboard/inspect"
  }
  // {
  //   title: "Intercambio",
  //   href: "inspect/interchange"
  // }
]

export default function Layout({
  children,
  modal
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <>
      <PageHeader
        title="Inspecciones"
        description="Realice inspecciones a unidades y remolques"
      />
      <SecondaryNav items={SecondaryNavItems} />
      <div className="flex grow">{children}</div>
      {modal}
    </>
  )
}
