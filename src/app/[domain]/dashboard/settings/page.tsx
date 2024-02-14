import { Suspense } from "react"
import LocationForm from "@/app/[domain]/dashboard/settings/location-form"
import LocationList from "@/app/[domain]/dashboard/settings/location-list"
import OrganizationDelete from "@/app/[domain]/dashboard/settings/organization-delete"
import OrganizationForm from "@/app/[domain]/dashboard/settings/organization-form"
import { MembershipRole } from "@prisma/client"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { getOrganizationBySubDomain } from "@/server/fetchers"
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

  const data = await getOrganizationBySubDomain(domain)

  if (!data) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl grow px-4 sm:px-0">
      <PageSubtitle
        title="Organización"
        description="Información general de la organización"
      />
      <OrganizationForm
        data={data}
        enabled={
          user?.role === MembershipRole.ADMIN ||
          user?.role === MembershipRole.OWNER
        }
      />
      <Separator className="my-8" />
      <PageSubtitle
        title="Ubicaciones"
        description="Sitios clave de la organización"
      />
      <LocationForm organizationId={data.id} />
      <Suspense fallback={<LocationSkeleton />}>
        <LocationList organizationId={data.id} />
      </Suspense>
      {user?.role === MembershipRole.ADMIN && (
        <OrganizationDelete organizationId={data.id} />
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
