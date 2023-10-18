import {
  InspectionResult,
  InspectionStatus,
  InspectionTripType
} from "@prisma/client"
import { format } from "date-fns"
import { ArrowLeft, Check, X } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getInspectionById } from "@/server/fetchers"
import { InspectionList } from "./inspection-list"

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
              <div className="border-t border-gray-100 py-3 sm:col-span-1">
                <dt className="text-sm font-medium leading-6">
                  Inspeccionado por
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {inspection.inspectedBy.user.name}
                </dd>
              </div>
              <div className="border-t border-gray-100 py-3 sm:col-span-1">
                <dt className="text-sm font-medium leading-6">Revisado por</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {inspection.approvedBy?.user.name}
                </dd>
              </div>
            </dl>
            <h2 className="text-base font-semibold leading-7">
              Resultado de la inspección
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <div className="grid grid-cols-2 items-center sm:grid-cols-3">
                  <Label>Resultado</Label>
                  <div className="sm:col-span-2">
                    {(() => {
                      switch (inspection.result) {
                        case InspectionResult.PASS:
                          return (
                            <Badge variant="green" className="gap-1 rounded">
                              <Check className="h-4 w-4" />
                              OK
                            </Badge>
                          )
                        case InspectionResult.FAIL:
                          return (
                            <Badge variant="red" className="gap-1 rounded">
                              <X className="h-4 w-4" />
                              Falla
                            </Badge>
                          )
                        default:
                          return null
                      }
                    })()}
                  </div>
                </div>
              </div>
              <div>
                <Label>Puntos de Inspección</Label>
                <Tabs defaultValue="fail" className="mt-2">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="fail">Fallas</TabsTrigger>
                    <TabsTrigger value="all">Todos</TabsTrigger>
                  </TabsList>
                  <TabsContent value="fail">
                    <InspectionList
                      inspectedBy={inspection.inspectedBy.user}
                      inspectionItems={inspection.inspectionItems}
                      showOnlyFailures
                    />
                  </TabsContent>
                  <TabsContent value="all">
                    <InspectionList
                      inspectedBy={inspection.inspectedBy.user}
                      inspectionItems={inspection.inspectionItems}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            <h2 className="text-base font-semibold leading-7">
              Información adicional
            </h2>
            <dl>
              <dt className="text-sm font-medium leading-6">
                Sello de Seguridad
              </dt>
              <dd className="my-2 min-h-[30px] rounded bg-gray-50 px-3 py-1.5 text-sm leading-6 text-gray-700">
                {inspection.sealNbr}
              </dd>
              <dt className="text-sm font-medium leading-6">
                Marcado de Llantas Tractor
              </dt>
              <dd className="my-2 min-h-[30px] rounded bg-gray-50 px-3 py-1.5 text-sm leading-6 text-gray-700">
                {inspection.tiresVehicle}
              </dd>
              <dt className="text-sm font-medium leading-6">
                Marcado de Llantas de Caja
              </dt>
              <dd className="my-2 min-h-[30px] rounded bg-gray-50 px-3 py-1.5 text-sm leading-6 text-gray-700">
                {inspection.tiresContainer}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
