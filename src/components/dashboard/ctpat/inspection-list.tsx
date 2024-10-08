import ItemMediaPreview from "@/app/[domain]/dashboard/ctpat/edit/[id]/item-media-preview"
import { InspectionResult, Prisma, type InspectionItem } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Check, CheckCircle, X } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn, getInitials } from "@/lib/utils"

export function InspectionList({
  inspectionItems,
  showOnlyFailures,
  inspectedBy
}: {
  inspectionItems: Partial<InspectionItem>[]
  inspectedBy: {
    id: string
    name: string
    username: string
  }
  showOnlyFailures?: boolean
}) {
  const countFailures = inspectionItems.filter(
    item => item.result === InspectionResult.FAIL
  ).length

  return (
    <div className="flex flex-col gap-3">
      {showOnlyFailures ? (
        countFailures > 0 ? (
          inspectionItems
            .filter(item => item.result === InspectionResult.FAIL)
            .map(item => (
              <InspectionListItem
                key={item.id}
                item={item}
                inspectedBy={inspectedBy}
              />
            ))
        ) : (
          <Alert variant="success">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>No hay fallas</AlertTitle>
            <AlertDescription>
              No se registraron fallas durante la inspección.
            </AlertDescription>
          </Alert>
        )
      ) : (
        inspectionItems.map(item => (
          <InspectionListItem
            key={item.id}
            item={item}
            inspectedBy={inspectedBy}
          />
        ))
      )}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const inspectionItemWithFiles =
  Prisma.validator<Prisma.InspectionItemDefaultArgs>()({
    include: {
      inspectionItemFiles: true
    }
  })

export function InspectionListItem({
  item,
  inspectedBy
}: {
  item: Partial<Prisma.InspectionItemGetPayload<typeof inspectionItemWithFiles>>
  inspectedBy: {
    id: string
    name: string
    username: string
  }
}) {
  return (
    <div
      key={item.id}
      className="flex w-full flex-col space-y-2 rounded-lg border px-4 py-3 shadow-sm dark:border-gray-700 dark:shadow-black"
    >
      <div className="flex flex-row items-center justify-between py-3">
        <div className="flex flex-row items-center gap-3">
          {typeof item.order === "number" && item.order < 17 && (
            <span
              className={cn(
                item.result === InspectionResult.PASS
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
                "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium"
              )}
            >
              {item.order + 1}
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
                <Badge variant="destructive" className="gap-1 rounded">
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
        <>
          <Separator />
          <div className="flex flex-row gap-4 pt-4">
            <Avatar>
              <AvatarFallback>{getInitials(inspectedBy.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex gap-1 text-xs font-medium text-gray-950 dark:text-white">
                {inspectedBy.name}
                {item.createdAt && (
                  <span className="text-gray-400">
                    {formatDistanceToNow(item.createdAt, {
                      addSuffix: true,
                      locale: es
                    })}
                  </span>
                )}
              </div>
              <span className="py-1.5 text-sm text-gray-600 dark:text-gray-300">
                {item.notes}
              </span>
            </div>
          </div>
        </>
      )}
      {item.inspectionItemFiles && (
        <ItemMediaPreview
          fileList={item.inspectionItemFiles}
          className="pt-3"
        />
      )}
    </div>
  )
}
