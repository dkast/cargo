import { Suspense } from "react"

import InspectionView from "@/components/dashboard/ctpat/inspection-view"
import Panel from "@/components/dashboard/page-panel"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

export default function CTPATModalPage({
  params: { id }
}: {
  params: { id: string }
}) {
  return (
    <Panel className="sm:w-1/2 sm:max-w-2xl">
      <ScrollArea className="h-[100%] px-4 sm:px-2">
        <Suspense fallback={<LoadingSkeleton />}>
          <InspectionView inspectionId={id} />
        </Suspense>
      </ScrollArea>
    </Panel>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center gap-4">
        <span className="mr-2 text-2xl text-gray-400">#</span>
        <Skeleton className="h-8 w-1/3" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="border-t border-gray-100 py-3 sm:col-span-1">
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="border-t border-gray-100 py-3 sm:col-span-1">
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  )
}
