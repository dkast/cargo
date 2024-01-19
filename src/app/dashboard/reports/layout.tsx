import PageHeader from "@/components/dashboard/page-header"
import SecondarySidebar from "@/components/dashboard/secondary-sidebar"

const SecondarySidebarItems = [
  {
    title: "CTPAT",
    children: [
      {
        title: "Inspecciones y Fallas",
        href: "/dashboard/reports"
      },
      {
        title: "Pareto de Fallas",
        href: "/dashboard/reports/ctpat-issues"
      }
    ]
  }
  // {
  //   title: "ISO",
  //   children: [
  //     {
  //       title: "Inspecciones",
  //       href: "/dashboard/reports/iso"
  //     },
  //     {
  //       title: "Inspecciones 2",
  //       href: "/dashboard/reports/test"
  //     }
  //   ]
  // }
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader
        title="Reportes"
        description="Consultas y reportes de los viajes e inspecciones"
      />
      <div className="flex grow flex-row">
        <SecondarySidebar items={SecondarySidebarItems} />
        <div className="flex grow p-4">{children}</div>
      </div>
    </>
  )
}
