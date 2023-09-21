import CTPATMainForm from "@/app/dashboard/inspect/new/ctpat-main-form"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { prisma } from "@/server/db"
import { getCurrentUser } from "@/lib/session"

export default async function NewCTPATPage() {
  const user = await getCurrentUser()

  const companies = await prisma.company.findMany({
    where: { organizationId: user?.organizationId }
  })

  return (
    <div className="mx-auto max-w-2xl grow px-3 sm:px-0">
      <PageSubtitle
        title="Inspección CTPAT"
        description="Realice una nueva inspección CTPAT"
      />
      <CTPATMainForm companies={companies} />
    </div>
  )
}
