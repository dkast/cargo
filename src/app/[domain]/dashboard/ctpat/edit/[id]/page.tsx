import ItemsForm from "@/app/[domain]/dashboard/ctpat/edit/[id]/items-form"
import { InspectionStatus, InspectionTripType } from "@prisma/client"
import { format } from "date-fns"
import { ArrowLeft, CheckCircle2, CircleDashed, CircleDot } from "lucide-react"
import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import {
  getInspectionById,
  getOrganizationBySubDomain
} from "@/server/fetchers"

export const metadata: Metadata = {
  title: "Inspección CTPAT"
}

export default async function CTPATEditPage({
  params: { domain, id }
}: {
  params: { domain: string; id: string }
}) {
  const inspection = await getInspectionById(id)
  const orgData = await getOrganizationBySubDomain(domain)

  if (!inspection || !orgData || inspection.organizationId !== orgData.id) {
    return notFound()
  }

  return (
    <div className="relative bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-2xl grow px-4 py-4 sm:px-0 sm:py-8">
          <Link
            href="../../inspect"
            className="mb-2 inline-block rounded-full border border-gray-200 p-1 hover:bg-gray-50 sm:absolute sm:left-4 sm:top-8"
          >
            <span className="sr-only">Volver</span>
            <ArrowLeft className="h-6 w-6" />
          </Link>
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
                <dt className="text-sm font-medium">Tipo Inspección</dt>
                <dd className="flex gap-x-2 text-sm leading-6 text-gray-700">
                  {inspection.tripType === InspectionTripType.IN ? (
                    <Badge variant="blue">Entrada</Badge>
                  ) : (
                    <Badge variant="blue">Salida</Badge>
                  )}
                  {inspection.location?.name}
                </dd>
              </dl>
              <dl className="space-y-1 sm:space-y-2">
                <dt className="text-sm font-medium">Fecha</dt>
                <dd className="text-sm leading-6 text-gray-700">
                  {inspection.start instanceof Date
                    ? format(inspection.start, "Pp")
                    : format(new Date(inspection.start), "Pp")}
                </dd>
              </dl>
              <dl className="space-y-1 sm:space-y-2">
                <dt className="text-sm font-medium">Transportista</dt>
                <dd className="text-sm leading-6 text-gray-700">
                  {inspection.company.name}
                </dd>
              </dl>
              <dl className="space-y-1 sm:space-y-2">
                <dt className="text-sm font-medium">Operador</dt>
                <dd className="text-sm leading-6 text-gray-700">
                  {inspection.operator.name}
                </dd>
              </dl>
              <dl className="space-y-1 sm:space-y-2">
                <dt className="text-sm font-medium">Tractor</dt>
                <dd className="text-sm leading-6 text-gray-700">
                  {inspection.vehicle.vehicleNbr}
                </dd>
              </dl>
              <dl className="space-y-1 sm:space-y-2">
                <dt className="text-sm font-medium">Remolque</dt>
                <dd className="flex items-center gap-2 text-sm leading-6 text-gray-700">
                  {inspection.container.containerNbr}
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
