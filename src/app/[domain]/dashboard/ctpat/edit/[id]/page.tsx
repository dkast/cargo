import BackButton from "@/app/[domain]/dashboard/ctpat/[id]/back-button"
import ItemsForm from "@/app/[domain]/dashboard/ctpat/edit/[id]/items-form"
import { InspectionStatus, InspectionTripType } from "@prisma/client"
import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import {
  Building,
  CalendarClock,
  CheckCircle2,
  CircleDashed,
  CircleDot,
  ClipboardCheck,
  Container,
  Truck,
  UserRound
} from "lucide-react"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { getOrganizationBySubDomain } from "@/server/fetchers"
import { getInspectionById } from "@/server/fetchers/ctpat"
import { getUserTimeZone } from "@/lib/session"

export const metadata: Metadata = {
  title: "Inspección CTPAT"
}

export default async function CTPATEditPage({
  params: { domain, id }
}: {
  params: { domain: string; id: string }
}) {
  const timezone = await getUserTimeZone()
  const inspection = await getInspectionById(id)
  const orgData = await getOrganizationBySubDomain(domain)

  if (!inspection || !orgData || inspection.organizationId !== orgData.id) {
    return notFound()
  }

  return (
    <div className="relative bg-gray-50 dark:bg-gray-950">
      <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mx-auto max-w-2xl grow px-4 py-4 sm:px-0 sm:py-8">
          <BackButton />
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="flex flex-row items-center gap-4 text-2xl">
                <div>
                  <span className="mr-2 text-gray-400">#</span>
                  <span>
                    {inspection.inspectionNbr.toString().padStart(5, "0")}
                  </span>
                </div>
                {(() => {
                  switch (inspection.status) {
                    case InspectionStatus.OPEN:
                      return (
                        <Badge variant="yellow">
                          <CircleDashed className="-ml-0.5 mr-1 size-3" />
                          En Proceso
                        </Badge>
                      )
                    case InspectionStatus.CLOSED:
                      return (
                        <Badge variant="blue">
                          <CircleDot className="-ml-0.5 mr-1 size-3" />
                          Cerrado
                        </Badge>
                      )
                    case InspectionStatus.APPROVED:
                      return (
                        <Badge variant="violet">
                          <CheckCircle2 className="-ml-0.5 mr-1 size-3" />
                          Aprobado
                        </Badge>
                      )
                    default:
                      return null
                  }
                })()}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-y-4 text-sm sm:grid-cols-3">
              <dl className="space-y-1 sm:space-y-2">
                <dt className="text-sm font-medium">
                  {" "}
                  <ClipboardCheck className="mr-1 inline size-4 align-text-top" />
                  Inspección
                </dt>
                <dd className="flex gap-x-2 text-sm leading-6 text-gray-700 dark:text-gray-400">
                  {inspection.location?.name}
                  {inspection.tripType === InspectionTripType.IN ? (
                    <Badge variant="blue">Entrada</Badge>
                  ) : (
                    <Badge variant="blue">Salida</Badge>
                  )}
                </dd>
              </dl>
              <dl className="space-y-1 sm:space-y-2">
                <dt className="text-sm font-medium">
                  <CalendarClock className="mr-1 inline size-4 align-text-top" />
                  Fecha
                </dt>
                <dd className="text-sm leading-6 text-gray-700 dark:text-gray-400">
                  {inspection.start instanceof Date
                    ? format(toZonedTime(inspection.start, timezone), "Pp")
                    : format(
                        toZonedTime(new Date(inspection.start), timezone),
                        "Pp"
                      )}
                </dd>
              </dl>
              <dl className="space-y-1 sm:space-y-2">
                <dt className="text-sm font-medium">
                  <Building className="mr-1 inline size-4 align-text-top" />
                  Transportista
                </dt>
                <dd className="text-sm leading-6 text-gray-700 dark:text-gray-400">
                  {inspection.company.name}
                </dd>
              </dl>
              <dl className="space-y-1 sm:space-y-2">
                <dt className="text-sm font-medium">
                  <UserRound className="mr-1 inline size-4 align-text-top" />
                  Operador
                </dt>
                <dd className="text-sm leading-6 text-gray-700 dark:text-gray-400">
                  {inspection.operator.name}
                </dd>
              </dl>
              <dl className="space-y-1 sm:space-y-2">
                <dt className="text-sm font-medium">
                  <Truck className="mr-1 inline size-4 align-text-top" />
                  Tractor
                </dt>
                <dd className="text-sm leading-6 text-gray-700 dark:text-gray-400">
                  {inspection.vehicle.vehicleNbr}
                </dd>
              </dl>
              <dl className="space-y-1 sm:space-y-2">
                <dt className="text-sm font-medium">
                  <Container className="mr-1 inline size-4 align-text-top" />
                  Remolque
                </dt>
                <dd className="flex items-center gap-2 text-sm leading-6 text-gray-700 dark:text-gray-400">
                  {inspection.container?.containerNbr ?? "Sin remolque"}
                  {inspection.isLoaded ? (
                    <Badge variant="violet" className="rounded">
                      Cargado
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="rounded">
                      Vacío
                    </Badge>
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      {/* Inspection detail */}
      <ItemsForm inspection={inspection} />
    </div>
  )
}
