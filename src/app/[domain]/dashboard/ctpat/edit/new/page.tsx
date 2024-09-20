import BackButton from "@/app/[domain]/dashboard/ctpat/[id]/back-button"
import CTPATMainForm from "@/app/[domain]/dashboard/ctpat/edit/new/ctpat-main-form"
import { OrganizationStatus } from "@prisma/client"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { AlertDue } from "@/components/dashboard/alert-due"
import PageSubtitle from "@/components/dashboard/page-subtitle"
import {
  getCompanies,
  getContainers,
  getLocations,
  getOperators,
  getVehicles
} from "@/server/fetchers"
import { getOrganizationBySubDomain } from "@/server/fetchers/organization"
import { getCurrentUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Nueva Inspección CTPAT"
}

export default async function NewCTPATPage({
  params: { domain }
}: {
  params: { domain: string }
}) {
  const orgData = await getOrganizationBySubDomain(domain)
  const user = await getCurrentUser()

  if (!orgData || !user) {
    notFound()
  }

  const companies = await getCompanies(orgData.id)
  const operators = await getOperators(orgData.id)
  const vehicles = await getVehicles(orgData.id)
  const containers = await getContainers(orgData.id)
  const locations = await getLocations(orgData.id, true)

  return (
    <div className="relative">
      <div className="mx-auto max-w-2xl grow px-4 py-4 sm:px-0 sm:py-8">
        <BackButton />
        <PageSubtitle
          title="Inspección CTPAT"
          description="Inspección 17 puntos criticos"
        />
        <AlertDue isDue={orgData.status === OrganizationStatus.DUE} />
        <CTPATMainForm
          companies={companies}
          operators={operators}
          vehicles={vehicles}
          containers={containers}
          locations={locations.map(location => ({
            ...location,
            description: location.description ?? ""
          }))}
          organizationId={orgData.id}
          membershipId={user.membershipId}
          isDisabled={orgData.status === "DUE"}
        />
      </div>
    </div>
  )
}
