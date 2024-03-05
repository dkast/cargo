import {
  InspectionResult,
  InspectionStatus,
  InspectionTripType
} from "@prisma/client"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Check,
  CheckCircle2,
  CircleDashed,
  CircleDot,
  ClipboardEdit,
  ExternalLink,
  File,
  Link2,
  X
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { InspectionApprove } from "@/components/dashboard/ctpat/inspection-approve"
import { InspectionList } from "@/components/dashboard/ctpat/inspection-list"
import Share from "@/components/dashboard/ctpat/share"
import { TooltipHelper } from "@/components/dashboard/tooltip-helper"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getInspectionById,
  getOrganizationBySubDomain
} from "@/server/fetchers"
import { getCurrentUser } from "@/lib/session"
import { canApprove, getInitials } from "@/lib/utils"

export default async function InspectionView({
  inspectionId,
  domain
}: {
  inspectionId: string
  domain: string
}) {
  const inspection = await getInspectionById(inspectionId)
  const orgData = await getOrganizationBySubDomain(domain)
  const user = await getCurrentUser()

  if (!inspection || !orgData || !user) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="flex flex-row items-center gap-4 text-2xl">
          <div>
            <span className="mr-2 text-gray-400">#</span>
            <span>{inspection.inspectionNbr.toString().padStart(5, "0")}</span>
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
        <div className="inline-flex rounded-md shadow-sm">
          <TooltipHelper content="Ver en pestaña">
            <Button
              size="icon"
              variant="ghost"
              asChild
              className="group rounded-r-none ring-1 ring-inset ring-gray-200 dark:ring-gray-700"
            >
              <Link
                href={`/${domain}/dashboard/ctpat/${inspection.id}`}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="h-4 w-4 opacity-70 group-hover:opacity-100" />
              </Link>
            </Button>
          </TooltipHelper>
          {(inspection.status === InspectionStatus.CLOSED ||
            inspection.status === InspectionStatus.APPROVED) && (
            <TooltipHelper content="Ver PDF">
              <Button
                size="icon"
                variant="ghost"
                asChild
                className="group -ml-px rounded-none ring-1 ring-inset ring-gray-200 dark:ring-gray-700"
              >
                <Link
                  href={`/${domain}/ctpat/${inspection.id}/pdf`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <File className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                </Link>
              </Button>
            </TooltipHelper>
          )}
          {inspection.status === InspectionStatus.OPEN && (
            <TooltipHelper content="Continuar inspección">
              <Button
                size="icon"
                variant="ghost"
                asChild
                className="group -ml-px rounded-none ring-1 ring-inset ring-gray-200 dark:ring-gray-700"
              >
                <Link href={`/${domain}/dashboard/ctpat/edit/${inspection.id}`}>
                  <ClipboardEdit className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                </Link>
              </Button>
            </TooltipHelper>
          )}
          <TooltipHelper content="Compartir">
            <div>
              <Share path={`/share/ctpat/${inspection.id}`}>
                <Button
                  size="icon"
                  variant="ghost"
                  className="group -ml-px rounded-l-none ring-1 ring-inset ring-gray-200 dark:ring-gray-700"
                >
                  <Link2 className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                </Button>
              </Share>
            </div>
          </TooltipHelper>
        </div>
      </div>
      <h2 className="text-base font-semibold leading-7">
        Información de la inspección
      </h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2">
        {inspection.location?.name && (
          <div className="border-t border-gray-100 py-3 dark:border-gray-800 sm:col-span-2">
            <dt className="text-sm font-medium leading-6">Ubicación</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-400 sm:mt-2">
              {inspection.location.name}
            </dd>
          </div>
        )}
        <div className="border-t border-gray-100 py-3 dark:border-gray-800 sm:col-span-1">
          <dt className="text-sm font-medium leading-6">Tipo de Inspección</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-400 sm:mt-2">
            {inspection.tripType === InspectionTripType.IN ? (
              <span>Entrada</span>
            ) : (
              <span>Salida</span>
            )}
          </dd>
        </div>
        <div className="border-t border-gray-100 py-3 dark:border-gray-800 sm:col-span-1">
          <dt className="text-sm font-medium leading-6">Resultado</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-400 sm:mt-2">
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
        <div className="border-t border-gray-100 py-3 dark:border-gray-800 sm:col-span-1">
          <dt className="text-sm font-medium leading-6">Fecha Inicio</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-400 sm:mt-2">
            {inspection.start instanceof Date
              ? format(inspection.start, "Pp", { locale: es })
              : format(new Date(inspection.start), "Pp", { locale: es })}
          </dd>
        </div>
        <div className="border-t border-gray-100 py-3 dark:border-gray-800 sm:col-span-1">
          <dt className="text-sm font-medium leading-6">Fecha Fin</dt>
          {inspection.end && (
            <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-400 sm:mt-2">
              {inspection.end instanceof Date
                ? format(inspection.end, "Pp", { locale: es })
                : format(new Date(inspection.end), "Pp", { locale: es })}
            </dd>
          )}
        </div>
        <div className="border-gray- border-t py-3 dark:border-gray-800 sm:col-span-1">
          <dt className="text-sm font-medium leading-6">Transportista</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-400 sm:mt-2">
            {inspection.company.name}
          </dd>
        </div>
        <div className="border-t border-gray-100 py-3 dark:border-gray-800 sm:col-span-1">
          <dt className="text-sm font-medium leading-6">Operador</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-400 sm:mt-2">
            {inspection.operator.name}
          </dd>
        </div>
        <div className="border-t border-gray-100 py-3 dark:border-gray-800 sm:col-span-1">
          <dt className="text-sm font-medium leading-6">Tractor</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-400 sm:mt-2">
            {inspection.vehicle.vehicleNbr}
          </dd>
        </div>
        <div className="border-t border-gray-100 py-3 dark:border-gray-800 sm:col-span-1">
          <dt className="text-sm font-medium leading-6">Remolque</dt>
          <dd className="mt-1 flex items-center gap-2 text-sm leading-6 text-gray-700 dark:text-gray-400 sm:mt-2">
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
        </div>
        <div className="border-t border-gray-100 py-3 dark:border-gray-800 sm:col-span-1">
          <dt className="text-sm font-medium leading-6">Inspeccionado por</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-400 sm:mt-2">
            <div className="flex flex-row gap-x-2">
              <Avatar className="size-6 text-[0.6rem] font-semibold">
                <AvatarFallback>
                  {getInitials(inspection.inspectedBy.user.name)}
                </AvatarFallback>
              </Avatar>
              {inspection.inspectedBy.user.name}
            </div>
          </dd>
        </div>
        <div className="border-t border-gray-100 py-3 dark:border-gray-800 sm:col-span-1">
          <dt className="text-sm font-medium leading-6">Revisado por</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-400 sm:mt-2">
            {inspection.approvedBy?.user.name && (
              <div className="flex flex-row gap-x-2">
                <Avatar className="size-6 text-[0.6rem] font-semibold">
                  <AvatarFallback>
                    {getInitials(inspection.approvedBy.user.name)}
                  </AvatarFallback>
                </Avatar>
                {inspection.approvedBy.user.name}
              </div>
            )}
            {inspection.notes && (
              <div className="mt-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm leading-6 text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 sm:mt-3">
                {inspection.notes}
              </div>
            )}
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
            <TabsContent value="fail" className="rounded focus-visible:ring-2">
              <InspectionList
                inspectedBy={inspection.inspectedBy.user}
                inspectionItems={inspection.inspectionItems}
                showOnlyFailures
              />
            </TabsContent>
            <TabsContent value="all" className="rounded focus-visible:ring-2">
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
        <dd className="my-2 min-h-[30px] rounded bg-gray-50 px-3 py-1.5 text-sm leading-6 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {inspection.sealNbr}
        </dd>
        <dt className="text-sm font-medium leading-6">
          Marcado de Llantas Tractor
        </dt>
        <dd className="my-2 min-h-[30px] rounded bg-gray-50 px-3 py-1.5 text-sm leading-6 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {inspection.tiresVehicle}
        </dd>
        <dt className="text-sm font-medium leading-6">
          Marcado de Llantas de Remolque
        </dt>
        <dd className="my-2 min-h-[30px] rounded bg-gray-50 px-3 py-1.5 text-sm leading-6 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {inspection.tiresContainer}
        </dd>
      </dl>
      {inspection.status === InspectionStatus.CLOSED &&
        canApprove(user.role) && (
          <InspectionApprove
            inspectionId={inspection.id}
            organizationId={inspection.organizationId}
          />
        )}
    </div>
  )
}
