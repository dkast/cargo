"use client"
// Empty state

export function EmptyState({
  icon,
  title
}: {
  icon?: React.ReactNode
  title: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-2">
      {icon && (
        <div className="rounded-xl bg-gradient-to-b from-orange-100 via-orange-50 to-gray-50  p-2 text-orange-400">
          {icon}
        </div>
      )}
      <span className="text-gray-500">{title}</span>
    </div>
  )
}
