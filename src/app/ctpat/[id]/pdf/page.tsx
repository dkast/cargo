"use client"

import PDFDocument from "@/app/ctpat/[id]/pdf/pdf-document"
import { PDFViewer } from "@react-pdf/renderer"

export default function PDFPage({
  params: { id }
}: {
  params: { id: string }
}) {
  return (
    <PDFViewer className="grow">
      <PDFDocument />
    </PDFViewer>
  )
}
