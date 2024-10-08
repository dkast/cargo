import { Suspense } from "react"
import LocationForm from "@/app/[domain]/dashboard/settings/location-form"
import LocationList from "@/app/[domain]/dashboard/settings/location-list"
import OrganizationDelete from "@/app/[domain]/dashboard/settings/organization-delete"
import OrganizationForm from "@/app/[domain]/dashboard/settings/organization-form"
import { MembershipRole, OrganizationStatus } from "@prisma/client"
import { Globe, MapPinned } from "lucide-react"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { AlertDue } from "@/components/dashboard/alert-due"
import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { getOrganizationBySubDomain } from "@/server/fetchers/organization"
import { getCurrentUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Configuración"
}

export default async function SettingsPage({
  params: { domain }
}: {
  params: { domain: string }
}) {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const orgData = await getOrganizationBySubDomain(domain)

  if (!orgData) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl grow px-4 sm:px-0">
      <AlertDue isDue={orgData.status === OrganizationStatus.DUE} />
      <PageSubtitle
        title="Organización"
        description="Información general de la organización"
        Icon={Globe}
      />
      <OrganizationForm
        data={orgData}
        enabled={
          user?.role === MembershipRole.ADMIN ||
          user?.role === MembershipRole.OWNER
        }
      />
      <Separator className="my-8" />
      <PageSubtitle
        title="Ubicaciones"
        description="Sitios clave de la organización"
        Icon={MapPinned}
      />
      <LocationForm organizationId={orgData.id} />
      <Suspense fallback={<LocationSkeleton />}>
        <LocationList organizationId={orgData.id} />
      </Suspense>
      {user?.role === MembershipRole.ADMIN && (
        <OrganizationDelete organizationId={orgData.id} />
      )}
    </div>
  )
}

function LocationSkeleton() {
  return (
    <Card className="mt-10">
      <CardHeader title="Ubicaciones">
        <Skeleton className="h-5 w-1/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}
