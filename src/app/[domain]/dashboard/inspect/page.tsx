import InspectionDataTable from "@/app/[domain]/dashboard/inspect/inspection-datatable"
import { InspectionType } from "@prisma/client"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from "@tanstack/react-query"
import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Button } from "@/components/ui/button"
import { getLocationsBySubDomain } from "@/server/fetchers"
import { getInspections } from "@/server/fetchers/ctpat"
import { getOrganizationBySubDomain } from "@/server/fetchers/organization"
import { type InspectionQueryFilter } from "@/lib/types"

export const metadata: Metadata = {
  title: "Inspecciones CTPAT"
}
export default async function CTPATPage({
  params: { domain },
  searchParams
}: {
  params: { domain: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const orgData = await getOrganizationBySubDomain(domain)

  if (!orgData) {
    notFound()
  }

  const filter: InspectionQueryFilter = {
    organizationId: orgData.id,
    inspectionType: InspectionType.CTPAT
  }

  if (searchParams.status) {
    if (typeof searchParams.status === "string") {
      filter.status = searchParams.status
    } else {
      filter.status = undefined
    }
  }
  if (searchParams.result) {
    if (typeof searchParams.result === "string") {
      filter.result = searchParams.result
    } else {
      filter.result = undefined
    }
  }
  if (searchParams.start) {
    if (typeof searchParams.start === "string") {
      filter.start = searchParams.start
    } else {
      filter.start = undefined
    }
  }
  if (searchParams.end) {
    if (typeof searchParams.end === "string") {
      filter.end = searchParams.end
    } else {
      filter.end = undefined
    }
  }
  if (searchParams.location) {
    if (typeof searchParams.location === "string") {
      filter.location = searchParams.location
    } else {
      filter.location = undefined
    }
  }

  const data = await getInspections(filter)

  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["locations"],
    queryFn: () => getLocationsBySubDomain(domain)
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mx-auto grow overflow-hidden px-4 sm:px-6">
        <PageSubtitle title="CTPAT" description="Inspecciones CTPAT">
          <Button asChild>
            <Link href="ctpat/edit/new">Nueva Inspección</Link>
          </Button>
        </PageSubtitle>
        <div className="mt-6">
          <InspectionDataTable data={data} />
        </div>
      </div>
    </HydrationBoundary>
  )
}
