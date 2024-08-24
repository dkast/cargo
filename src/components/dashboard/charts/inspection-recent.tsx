import { InspectionResult } from "@prisma/client"
import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { getInspections } from "@/server/fetchers/ctpat"
import { getUserTimeZone } from "@/lib/session"
import { type InspectionQueryFilter } from "@/lib/types"
import { cn } from "@/lib/utils"

const color = {
  OPEN: "bg-amber-100 text-amber-500 dark:bg-amber-950",
  CLOSED: "bg-blue-100 text-blue-500 dark:bg-blue-950",
  APPROVED: "bg-violet-100 text-violet-500 dark:bg-violet-950"
}

async function InspectionRecent({
  filter,
  className
}: {
  filter: InspectionQueryFilter
  className?: string
}) {
  const data = await getInspections({
    organizationId: filter.organizationId,
    inspectionType: filter.inspectionType,
    take: 5
  })

  const timezone = await getUserTimeZone()

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <CardTitle className="text-base font-medium">
          Inspecciones recientes
        </CardTitle>
        <Button asChild size="xs" variant="ghost" className="text-xs">
          <Link href="dashboard/inspect">
            Ver más <ArrowRight className="ml-1 opacity-70" size={16} />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="[&_tr]:border-b-0">
            <TableRow>
              <TableHead className="h-10 rounded-l-md bg-gray-50 dark:bg-gray-900">
                # Folio
              </TableHead>
              <TableHead className="h-10 bg-gray-50 dark:bg-gray-900">
                Ubicación
              </TableHead>
              <TableHead className="h-10 bg-gray-50 dark:bg-gray-900">
                Transportista
              </TableHead>
              <TableHead className="h-10 rounded-r-md bg-gray-50 text-center dark:bg-gray-900">
                Resultado
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(inspection => (
              <TableRow key={inspection.id} className="dark:border-gray-800">
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
                      <span>
                        {format(
                          toZonedTime(inspection.start, timezone),
                          "dd/LL/yy HH:mm"
                        )}
                      </span>
                    ) : (
                      <span>
                        {format(
                          toZonedTime(new Date(inspection.start), timezone),
                          "dd/LL/YY HH:mm"
                        )}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="p-2">
                  {inspection.location?.name ?? "Sin ubicación"}
                </TableCell>
                <TableCell className="p-2">
                  {inspection.company?.name}
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
                          <Badge variant="destructive" className="rounded">
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
