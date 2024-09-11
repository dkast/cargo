import { Inbox } from "lucide-react"
import type { Metadata } from "next/types"

import { EmptyState } from "@/components/dashboard/empty-state"
import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@/components/ui/table"
import { getWaitList } from "@/server/fetchers"

export const metadata: Metadata = {
  title: "Lista de Espera"
}

export default async function Page() {
  const waitlist = await getWaitList()
  return (
    <div className="mx-auto max-w-2xl grow px-4 sm:px-0">
      <PageSubtitle
        title="Lista de Espera"
        description="Registros de lista de espera"
      />
      <Card className="mt-8">
        <CardHeader />
        <CardContent>
          {waitlist.length === 0 ? (
            <EmptyState title="No hay registros" icon={<Inbox />} />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {waitlist.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.email}</TableCell>
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
