import { InspectionResult, type InspectionItem } from "@prisma/client"
import { Check, MessageSquare, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function InspectionListItem({
  item
}: {
  item: Partial<InspectionItem>
}) {
  return (
    <div
      key={item.id}
      className="flex w-full flex-col rounded-lg border px-4 py-3 shadow-sm"
    >
      <div className="flex flex-row items-center justify-between py-3">
        <div className="flex flex-row items-center gap-3">
          {item.order! < 17 && (
            <span
              className={cn(
                item.result === InspectionResult.PASS
                  ? "bg-green-50 text-green-700 ring-green-700/10"
                  : "bg-red-50 text-red-700 ring-red-700/10",
                "flex h-7 w-7 items-center justify-center rounded-full text-sm ring-1 ring-inset"
              )}
            >
              {item.order! + 1}
            </span>
          )}
          <span>{item.question}</span>
        </div>
        {(() => {
          switch (item.result) {
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
      {item.result === InspectionResult.FAIL && (
        <div className="flex flex-row gap-4 border-t pt-4 text-gray-500">
          <MessageSquare className="h-4 w-4" />
          <span className="text-sm">{item.notes}</span>
        </div>
      )}
    </div>
  )
}
