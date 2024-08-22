import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { getOrganizationById } from "@/server/fetchers"
import { getInspectionById } from "@/server/fetchers/ctpat"
import PDFDocument from "./pdf-document"

export const metadata: Metadata = {
  title: "Documento PDF"
}

export default async function PDFPage({
  params: { id }
}: {
  params: { id: string }
}) {
  const inspection = await getInspectionById(id)

  if (!inspection) {
    return notFound()
  }

  const organization = await getOrganizationById(inspection.organizationId)

  if (!organization) {
    return notFound()
  }

  return <PDFDocument inspection={inspection} organization={organization} />
}
