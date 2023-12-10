import { format } from "date-fns"
import { es } from "date-fns/locale"

import PageHeader from "@/components/dashboard/page-header"
import SecondaryNav from "@/components/dashboard/secondary-nav"
import { getCurrentUser } from "@/lib/session"

const SecondaryNavItems = [
  {
    title: "CTPAT",
    href: "/dashboard"
  }
]

export default async function Layout({
  children
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) return null

  const humanDate = format(new Date(), "EEEE, d MMMM yyyy", { locale: es })
  const greeting = user.name ? `Hola, ${user.name.split(" ")[0]}` : "Hola"
  return (
    <>
      <PageHeader title={greeting} description={humanDate} />
      <SecondaryNav items={SecondaryNavItems} />
      <div className="flex grow">{children}</div>
    </>
  )
}
