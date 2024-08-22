import { InspectionTripType, type Prisma } from "@prisma/client"
import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import {
  ArrowDownToDot,
  ArrowUpFromDot,
  CircleDashed,
  Truck
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getOpenInspectionsByLocation } from "@/server/fetchers/ctpat"
import type { InspectionQueryFilter } from "@/lib/types"
import { cn } from "@/lib/utils"

export default async function InspectionLocationCard({
  filter,
  className
}: {
  filter: InspectionQueryFilter
  className?: string
}) {
  const data = await getOpenInspectionsByLocation(filter)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Ubicaciones con Inspección
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {data.map(location => (
          <LocationStatus location={location} key={location.id} />
        ))}
      </CardContent>
    </Card>
  )
}

function LocationStatus({
  location
}: {
  location: Prisma.PromiseReturnType<typeof getOpenInspectionsByLocation>[0]
}) {
  const isActive = location.inspections.length > 0
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border p-3",
        isActive
          ? "border-amber-400 dark:border-amber-500/40"
          : "dark:border-gray-800"
      )}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <div>
          <h3>{location.name}</h3>
        </div>
        {isActive ? (
          <Badge variant="yellow">
            <CircleDashed className="-ml-0.5 mr-1 size-3" />
            En Proceso
          </Badge>
        ) : (
          <Badge variant="secondary">Libre</Badge>
        )}
      </div>
      {isActive && (
        <>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4">
            {/* Entry/Exit */}
            <div className="relative flex items-center justify-between px-2">
              <div
                aria-hidden="true"
                className="absolute inset-x-10 inset-y-0 flex items-center"
              >
                <div className="w-full border-t-2 border-amber-500" />
              </div>
              <div className="relative flex justify-center">
                <span className="rounded-full bg-amber-500 p-1 text-amber-50 dark:text-amber-950">
                  {location.inspections[0]?.tripType ===
                  InspectionTripType.IN ? (
                    <ArrowDownToDot className="size-4 rotate-90" />
                  ) : (
                    <Truck className="size-4" />
                  )}
                </span>
              </div>
              <div className="relative flex justify-start">
                <span className="rounded-full bg-amber-500 p-1 text-amber-50 dark:text-amber-950">
                  {location.inspections[0]?.tripType ===
                  InspectionTripType.IN ? (
                    <Truck className="size-4 -scale-x-100" />
                  ) : (
                    <ArrowUpFromDot className="size-4 rotate-90" />
                  )}
                </span>
              </div>
            </div>
            {/* Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="flex flex-col items-start gap-1">
                <dt className="text-xs text-gray-500 dark:text-gray-400">
                  {location.inspections[0]?.tripType === InspectionTripType.IN
                    ? "Entrada"
                    : "Salida"}
                </dt>
                <dd className="text-xs font-medium">
                  {/* TODO: Get the correct timezone for the location */}
                  {format(
                    toZonedTime(
                      location.inspections[0]?.start ?? new Date(),
                      "America/Matamoros"
                    ),
                    "HH:mm"
                  )}
                </dd>
              </div>
              <div className="flex flex-col items-start gap-1 md:hidden xl:flex">
                <dt className="text-xs text-gray-500 dark:text-gray-400">
                  Folio
                </dt>
                <dd className="text-xs font-medium">
                  #{" "}
                  {location.inspections[0]?.inspectionNbr
                    .toString()
                    .padStart(5, "0")}
                </dd>
              </div>
            </div>
            {/* Vehicle data */}
            <div className="flex flex-col items-start gap-1">
              <dt className="text-xs text-gray-500 dark:text-gray-400">
                Tractor
              </dt>
              <dd className="text-xs font-medium">
                {location.inspections[0]?.vehicle.vehicleNbr}
              </dd>
            </div>
            <div className="flex flex-col items-start gap-1">
              <dt className="text-xs text-gray-500 dark:text-gray-400">
                Remolque
              </dt>
              <dd className="space-x-2 text-xs lg:space-x-0 lg:space-y-2 2xl:space-x-2">
                <span className="font-medium">
                  {location.inspections[0]?.container.containerNbr}
                </span>
                {location.inspections[0]?.isLoaded ? (
                  <Badge variant="violet" className="rounded">
                    Cargado
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="rounded">
                    Vacío
                  </Badge>
                )}
              </dd>
            </div>
            <div className="flex flex-col items-start gap-1 md:hidden xl:flex">
              <dt className="text-xs text-gray-500 dark:text-gray-400">
                Transportista
              </dt>
              <dd className="text-xs font-medium">
                {location.inspections[0]?.company.name}
              </dd>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
