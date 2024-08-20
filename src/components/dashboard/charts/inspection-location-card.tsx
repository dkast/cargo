import { ArrowDownToDot, CircleDashed, Truck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function InspectionLocationCard({
  className
}: {
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Ubicaciones con Inspección
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LocationStatus />
      </CardContent>
    </Card>
  )
}

function LocationStatus() {
  return (
    <div className="flex flex-col rounded-lg border p-3 dark:border-gray-800">
      <div className="flex w-full flex-row items-center justify-between">
        <div>
          <h3>Caseta 1</h3>
        </div>
        <Badge variant="yellow">
          <CircleDashed className="-ml-0.5 mr-1 size-3" />
          En Proceso
        </Badge>
      </div>
      <Separator className="my-4" />
      <div className="relative">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <div className="w-1/2 border-t-2 border-indigo-500" />
        </div>
        <div className="relative flex justify-center">
          <span className="rounded-full bg-indigo-500 p-1 text-white">
            <Truck className="size-5 -scale-x-100" />
          </span>
        </div>
        <div className="relative flex justify-start">
          <span className="rounded-full bg-indigo-500 p-1 text-white">
            <ArrowDownToDot className="size-5" />
          </span>
        </div>
      </div>
    </div>
  )
}
