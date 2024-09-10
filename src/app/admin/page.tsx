import type { Metadata } from "next/types"

import PageSubtitle from "@/components/dashboard/page-subtitle"

export const metadata: Metadata = {
  title: "Lista de Espera"
}

export default function Page() {
  return (
    <div className="mx-auto max-w-2xl grow px-4 sm:px-0">
      <PageSubtitle
        title="Lista de Espera"
        description="Registros de lista de espera"
      />
    </div>
  )
}
