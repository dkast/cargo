import { type Metadata } from "next"

import { getInspectionById } from "@/server/fetchers"
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

  return <PDFDocument inspection={inspection} />
}
