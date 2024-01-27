import { InspectionResult } from "@prisma/client"
import { TableCell } from "@tremor/react"
import { format } from "date-fns"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { getInspections } from "@/server/fetchers"
import { getCurrentUser } from "@/lib/session"
import { type InspectionQueryFilter } from "@/lib/types"
import { cn } from "@/lib/utils"

const color = {
  OPEN: "bg-amber-100 text-amber-500",
  CLOSED: "bg-blue-100 text-blue-500",
  APPROVED: "bg-violet-100 text-violet-500"
}

async function InspectionRecent({ className }: { className?: string }) {
  const user = await getCurrentUser()

  if (!user) return null

  const filter: InspectionQueryFilter = {
    organizationId: user.organizationId,
    take: 5
  }
  const data = await getInspections(filter)
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <CardTitle className="text-base font-medium">
          Inspecciones recientes
        </CardTitle>
        <Button asChild size="xs" variant="outline" className="text-xs">
          <Link href="/dashboard/inspect">
            Ver todas <ArrowRight className="ml-1 opacity-70" size={16} />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead># Folio</TableHead>
              <TableHead>Resultado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(inspection => (
              <TableRow key={inspection.id}>
                <TableCell className="flex flex-col gap-1 p-2">
                  <div className="flex flex-row items-center gap-2">
                    <div
                      className={cn(
                        color[inspection.status],
                        "flex-none rounded-full p-1"
                      )}
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-current" />
                    </div>
                    <span>
                      {inspection.inspectionNbr.toString().padStart(5, "0")}
                    </span>
                  </div>
                  <div className="ml-5 text-xs text-gray-500">
                    {inspection.start instanceof Date ? (
                      <span>{format(inspection.start, "dd/LL/yy HH:mm")}</span>
                    ) : (
                      <span>
                        {format(new Date(inspection.start), "dd/LL/YY HH:mm")}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="p-2 text-center">
                  {(() => {
                    switch (inspection.result) {
                      case InspectionResult.PASS:
                        return (
                          <Badge variant="green" className="rounded">
                            OK
                          </Badge>
                        )
                      case InspectionResult.FAIL:
                        return (
                          <Badge variant="red" className="rounded">
                            Falla
                          </Badge>
                        )
                      default:
                        return null
                    }
                  })()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
export default InspectionRecent
