import { notFound } from "next/navigation"

import InspectionView from "@/components/dashboard/ctpat/inspection-view"
import Panel from "@/components/dashboard/page-panel"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getInspectionById } from "@/server/fetchers"

export default async function CTPATModalPage({
  params: { id }
}: {
  params: { id: string }
}) {
  const inspection = await getInspectionById(id)

  if (!inspection) {
    return notFound()
  }

  return (
    <Panel className="sm:w-2/3 sm:max-w-xl">
      <ScrollArea className="h-[100%] px-4 sm:px-2">
        <InspectionView inspection={inspection} />
      </ScrollArea>
    </Panel>
  )
}
