import { Building } from "lucide-react"
import type { Metadata } from "next/types"

import PageSubtitle from "@/components/dashboard/page-subtitle"

export const metadata: Metadata = {
  title: "Editar Organización"
}

export default async function OrganizationPage({
  params: { id }
}: {
  params: { id: string }
}) {
  return (
    <div className="mx-auto max-w-2xl grow px-4 sm:px-0">
      <PageSubtitle
        title="Organización"
        description="Editar la organización"
        Icon={Building}
      />
    </div>
  )
}
