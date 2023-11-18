import PDFDocument from "@/app/ctpat/[id]/pdf/pdf-document"

import { getInspectionById } from "@/server/fetchers"

export default async function PDFPage({
  params: { id }
}: {
  params: { id: string }
}) {
  const inspection = await getInspectionById(id)

  return <PDFDocument inspection={inspection} />
}
