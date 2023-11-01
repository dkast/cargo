import {
  InspectionResult,
  InspectionStatus,
  InspectionTripType
} from "@prisma/client"
import { format } from "date-fns"
import { Check, X } from "lucide-react"
import { notFound } from "next/navigation"

import { InspectionList } from "@/components/dashboard/ctpat/inspection-list"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getInspectionById } from "@/server/fetchers"

export default async function InspectionView({
  inspectionId
}: {
  inspectionId: string
}) {
  const inspection = await getInspectionById(inspectionId)

  if (!inspection) {
    return notFound()
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="flex flex-row items-center gap-4 text-2xl">
          <div>
            <span className="mr-2 text-gray-400">#</span>
            <span>{inspection.inspectionNbr.toString().padStart(5, "0")}</span>
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
          <dt className="text-sm font-medium leading-6">Tipo de Inspección</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            {inspection.tripType === InspectionTripType.IN ? (
              <span>Entrada</span>
            ) : (
              <span>Salida</span>
            )}
          </dd>
        </div>
        <div className="border-t border-gray-100 py-3 sm:col-span-1">
          <dt className="text-sm font-medium leading-6">Resultado</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
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
          </dd>
        </div>
        <div className="border-t border-gray-100 py-3 sm:col-span-1">
          <dt className="text-sm font-medium leading-6">Fecha Inicio</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            {inspection.start instanceof Date
              ? format(inspection.start, "Pp")
              : format(new Date(inspection.start), "Pp")}
          </dd>
        </div>
        <div className="border-t border-gray-100 py-3 sm:col-span-1">
          <dt className="text-sm font-medium leading-6">Fecha Fin</dt>
          {inspection.end && (
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {inspection.end instanceof Date
                ? format(inspection.end, "Pp")
                : format(new Date(inspection.end), "Pp")}
            </dd>
          )}
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
          <dt className="text-sm font-medium leading-6">Inspeccionado por</dt>
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
        Puntos de Inspección
      </h2>
      <div className="flex flex-col gap-4">
        <div>
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
        <dt className="text-sm font-medium leading-6">Sello de Seguridad</dt>
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
  )
}