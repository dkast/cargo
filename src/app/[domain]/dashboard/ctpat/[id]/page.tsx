import BackButton from "@/app/[domain]/dashboard/ctpat/[id]/back-button"
import { type Metadata } from "next"

import InspectionView from "@/components/dashboard/ctpat/inspection-view"

export const metadata: Metadata = {
  title: "Ver Inspección CTPAT"
}

export default function CTPATViewPage({
  params: { domain, id }
}: {
  params: { domain: string; id: string }
}) {
  return (
    <div>
      <div className="relative">
        <div className="mx-auto max-w-2xl grow px-4 py-4 sm:px-0 sm:py-8">
          <BackButton />
          <InspectionView domain={domain} inspectionId={id} />
        </div>
      </div>
    </div>
  )
}
