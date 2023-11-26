import { getInspectionById } from "@/server/fetchers"
import PDFDocument from "./pdf-document"

export default async function PDFPage({
  params: { id }
}: {
  params: { id: string }
}) {
  const inspection = await getInspectionById(id)

  return <PDFDocument inspection={inspection} />
}
