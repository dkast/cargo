"use client"

import { ArrowLeft } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

export default function BackButton() {
  const params = useParams<{ domain: string }>()
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => router.push(`/${params.domain}/dashboard/inspect`)}
      className="mb-2 inline-block rounded-full border border-gray-200 p-1 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 sm:absolute sm:left-4 sm:top-8"
    >
      <span className="sr-only">Volver</span>
      <ArrowLeft className="h-6 w-6" />
    </button>
  )
}
