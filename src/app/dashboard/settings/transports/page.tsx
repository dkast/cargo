import TestForm from "@/app/dashboard/settings/transports/test-form"
import { notFound } from "next/navigation"

import { getCompanies } from "@/server/fetchers"
import { getCurrentUser } from "@/lib/session"

export default async function Page() {
  const user = await getCurrentUser()

  if (!user?.organizationId) {
    notFound()
  }

  const companies = await getCompanies(user?.organizationId)

  return (
    <div className="mx-auto max-w-2xl grow px-3 sm:px-0">
      <TestForm companies={companies} />
    </div>
  )
}
