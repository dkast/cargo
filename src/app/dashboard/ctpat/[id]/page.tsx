import ItemsForm from "@/app/dashboard/ctpat/[id]/items-form"
import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getInspectionById } from "@/server/fetchers"

export default async function CTPATPage({
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
    <div className="relative bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-2xl grow px-3 py-4 sm:px-0 sm:py-8">
          <Link
            href="/dashboard/inspect"
            className="mb-2 inline-block rounded-full border border-gray-200 p-1 hover:bg-gray-50 sm:absolute sm:left-4 sm:top-8"
          >
            <span className="sr-only">Volver</span>
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="space-x-2 text-2xl">
                <span className="text-gray-400">#</span>
                <span>
                  {inspection.inspectionNbr.toString().padStart(5, "0")}
                </span>
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-y-4 text-sm sm:grid-cols-4">
              <dl>
                <dt className="text-sm text-gray-500">Fecha de inicio</dt>
                <dd>
                  {inspection.start instanceof Date
                    ? format(inspection.start, "Pp")
                    : format(new Date(inspection.start), "Pp")}
                </dd>
              </dl>
              <dl>
                <dt className="text-sm text-gray-500">Transportista</dt>
                <dd>{inspection.company.name}</dd>
              </dl>
              <dl>
                <dt className="text-sm text-gray-500">Operador</dt>
                <dd>{inspection.operator.name}</dd>
              </dl>
              <dl>
                <dt className="text-sm text-gray-500">Remolque</dt>
                <dd>{inspection.vehicle.vehicleNbr}</dd>
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
