import CTPATMainForm from "@/app/dashboard/inspect/new/ctpat-main-form"

import PageSubtitle from "@/components/dashboard/page-subtitle"

export default function NewCTPATPage() {
  return (
    <div className="mx-auto max-w-2xl grow px-3 sm:px-0">
      <PageSubtitle
        title="Inspección CTPAT"
        description="Realice una nueva inspección CTPAT"
      />
      <CTPATMainForm />
    </div>
  )
}
