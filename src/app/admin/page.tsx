import { Building, Inbox } from "lucide-react"
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

export const metadata: Metadata = {
  title: "General"
}

export default async function Page() {
  const waitlist = await getWaitList()
  return (
    <div className="mx-auto max-w-2xl grow px-4 sm:px-0">
      <PageSubtitle
        title="Organizaciones"
        description="Gestione las organizaciones en la plataforma"
        Icon={Building}
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
                    {/* <TableCell>
                      <Button size="xs" variant="destructive">
                        Eliminar
                      </Button>
                    </TableCell> */}
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
