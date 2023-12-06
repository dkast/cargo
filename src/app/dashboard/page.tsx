import { format } from "date-fns"
import { es } from "date-fns/locale"
import { type Metadata } from "next"

import PageHeader from "@/components/dashboard/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Inicio"
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) return null

  const humanDate = format(new Date(), "EEEE, d MMMM yyyy", { locale: es })
  const greeting = user.name ? `Hola, ${user.name.split(" ")[0]}` : "Hola"
  return (
    <>
      <PageHeader title={greeting} description={humanDate} />
      <section className="grid grid-cols-3 px-3 py-4">
        <Card>
          <CardHeader>
            <CardTitle>Contenedores</CardTitle>
          </CardHeader>
          <CardContent>Hola Mundo</CardContent>
        </Card>
      </section>
    </>
  )
}
