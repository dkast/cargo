import WaitlistDelete from "@/app/admin/waitlist/waitlist-delete"
import { MembershipRole } from "@prisma/client"
import { Inbox, MailCheck } from "lucide-react"
import { redirect } from "next/navigation"
import type { Metadata } from "next/types"

import { EmptyState } from "@/components/dashboard/empty-state"
import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { getWaitList } from "@/server/fetchers"
import { getCurrentUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Lista de Espera"
}

export default async function Page() {
  const user = await getCurrentUser()

  if (!user || user.role !== MembershipRole.ADMIN) {
    redirect("/access-denied")
  }

  const waitlist = await getWaitList()

  return (
    <div className="mx-auto max-w-2xl grow px-4 sm:px-0">
      <PageSubtitle
        title="Lista de Espera"
        description="Listado de contactos suscritos a la lista de correo"
        Icon={MailCheck}
      />
      <Card>
        <CardContent className="p-4">
          {waitlist.length === 0 ? (
            <EmptyState title="No hay registros" icon={<Inbox />} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Alta</TableHead>
                  {/* <TableHead>Acciones</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitlist.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <WaitlistDelete id={item.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
