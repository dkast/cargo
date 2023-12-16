"use client"
// Empty state

export function EmptyState({ icon }: { icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-2">
      {icon && (
        <div className="rounded-xl bg-orange-100 p-2 text-orange-400">
          {icon}
        </div>
      )}
      <span className="text-gray-500">No hay ubicaciones</span>
    </div>
  )
}
