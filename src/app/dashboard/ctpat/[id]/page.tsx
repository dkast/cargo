import { ArrowLeft } from "lucide-react"
import { type Metadata } from "next"
import Link from "next/link"

import InspectionView from "@/components/dashboard/ctpat/inspection-view"

export const metadata: Metadata = {
  title: "Ver Inspección CTPAT"
}

export default async function CTPATViewPage({
  params: { id }
}: {
  params: { id: string }
}) {
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
          <InspectionView inspectionId={id} />
        </div>
      </div>
    </div>
  )
}
