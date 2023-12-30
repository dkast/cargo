import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { getInspectionIssuesCount } from "@/server/fetchers"
import { type InspectionQueryFilter } from "@/lib/types"
import { cn } from "@/lib/utils"

type ResultData = {
  issue: string
  total: bigint
}

export default async function InspectionIssueList({
  filter,
  className
}: {
  filter: InspectionQueryFilter
  className?: string
}) {
  const data = (await getInspectionIssuesCount(filter)) as ResultData[]

  console.dir(data)
  return (
    <Card className={cn(className, "p-0")}>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="text-xs uppercase tracking-tight">
            <TableRow>
              <TableHead>Tipo Falla</TableHead>
              <TableHead>Ocurrencias</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(item => (
              <TableRow key={item.issue}>
                <TableCell>{item.issue}</TableCell>
                <TableCell>{Number(item.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
