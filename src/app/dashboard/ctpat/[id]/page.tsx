import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function CTPATPage({
  params
}: {
  params: { id: string }
}) {
  const { id } = params

  return (
    <div className="relative">
      <Link
        href="/dashboard/inspect"
        className="absolute left-4 top-0 rounded-full border border-gray-200 p-1 hover:bg-gray-50"
      >
        <span className="sr-only">Volver</span>
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <div className="mx-auto max-w-2xl grow px-3 sm:px-0">
        <h1 className="space-x-2 text-2xl">
          <span className="text-gray-400">#</span>
          <span>{id}</span>
        </h1>
      </div>
    </div>
  )
}
