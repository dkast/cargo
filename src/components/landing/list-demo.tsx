import { Badge } from "@/components/ui/badge"
import { ctpatInspections } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function ListDemo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-y-2 p-4", className)}>
      {ctpatInspections.map((inspection, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-lg border px-4 py-2 shadow-sm"
        >
          <span className="text-sm">{inspection}</span>
          {index === 2 ? (
            <span className="relative flex">
              <span className="absolute inset-0 mx-2 my-0.5 animate-ping rounded-sm bg-red-400 opacity-30"></span>
              <Badge variant="red" className="relative rounded">
                Falla
              </Badge>
            </span>
          ) : (
            <Badge variant="green" className="rounded">
              OK
            </Badge>
          )}
        </div>
      ))}
    </div>
  )
}
