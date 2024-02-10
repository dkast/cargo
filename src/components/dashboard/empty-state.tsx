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
        <div className="rounded-xl border border-gray-300 bg-gray-50 p-2 text-gray-400 shadow-inner shadow-white ring ring-gray-200">
          {icon}
        </div>
      )}
      <span className="font-medium text-gray-500">{title}</span>
    </div>
  )
}
