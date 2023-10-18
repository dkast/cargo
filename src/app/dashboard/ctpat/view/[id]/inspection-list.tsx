import { InspectionResult, type InspectionItem } from "@prisma/client"

import { InspectionListItem } from "./inspection-list-item"

export function InspectionList({
  inspectionItems,
  showOnlyFailures
}: {
  inspectionItems: Partial<InspectionItem>[]
  showOnlyFailures?: boolean
}) {
  return (
    <div className="flex flex-col gap-3">
      {showOnlyFailures
        ? inspectionItems
            .filter(item => item.result === InspectionResult.FAIL)
            .map(item => <InspectionListItem key={item.id} item={item} />)
        : inspectionItems.map(item => (
            <InspectionListItem key={item.id} item={item} />
          ))}
    </div>
  )
}
