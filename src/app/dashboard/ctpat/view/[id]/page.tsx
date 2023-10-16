import { InspectionStatus, InspectionTripType } from "@prisma/client"
import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { getInspectionById } from "@/server/fetchers"

export default async function CTPATViewPage({
  params
}: {
  params: { id: string }
}) {
  const { id } = params

  const inspection = await getInspectionById(id)

  if (!inspection) {
    return notFound()
  }

  return (
    <div>
      <div className="relative">
        <div className="mx-auto max-w-2xl grow px-4 py-4 sm:px-0 sm:py-8">
          <Link
            href="/dashboard/inspect"
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
                      return <Badge variant="yellow">Pendiente</Badge>
                    case InspectionStatus.CLOSED:
                      return <Badge variant="blue">Cerrado</Badge>
                    case InspectionStatus.APPROVED:
                      return <Badge variant="green">Aprobado</Badge>
                    default:
                      return null
                  }
                })()}
              </h1>
            </div>
            <h2 className="text-base font-semibold leading-7">
              Información de la inspección
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2">
              <div className="border-t border-gray-100 py-3 sm:col-span-1">
                <dt className="text-sm font-medium leading-6">
                  Tipo de Inspección
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {inspection.tripType === InspectionTripType.IN ? (
                    <span>Entrada</span>
                  ) : (
                    <span>Salida</span>
                  )}
                </dd>
              </div>
              <div className="border-t border-gray-100 py-3 sm:col-span-1">
                <dt className="text-sm font-medium leading-6">Fecha</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {inspection.start instanceof Date
                    ? format(inspection.start, "Pp")
                    : format(new Date(inspection.start), "Pp")}
                </dd>
              </div>
              <div className="border-t border-gray-100 py-3 sm:col-span-1">
                <dt className="text-sm font-medium leading-6">Transportista</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {inspection.company.name}
                </dd>
              </div>
              <div className="border-t border-gray-100 py-3 sm:col-span-1">
                <dt className="text-sm font-medium leading-6">Operador</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {inspection.operator.name}
                </dd>
              </div>
              <div className="border-t border-gray-100 py-3 sm:col-span-1">
                <dt className="text-sm font-medium leading-6">Remolque</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {inspection.vehicle.vehicleNbr}
                </dd>
              </div>
              <div className="border-t border-gray-100 py-3 sm:col-span-1">
                <dt className="text-sm font-medium leading-6">Carga</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {inspection.isLoaded ? (
                    <Badge variant="yellow" className="rounded">
                      Cargado
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="rounded">
                      Vacío
                    </Badge>
                  )}
                </dd>
              </div>
            </dl>
            <h2 className="text-base font-semibold leading-7">
              Resultados de la inspección
            </h2>
          </div>
        </div>
      </div>
      {/* Inspection detail */}
      {/* <ItemsForm inspection={inspection} /> */}
    </div>
  )
}