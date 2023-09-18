import Link from "next/link"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Button } from "@/components/ui/button"

export default function CTPATPage() {
  return (
    <div className="mx-auto grow px-3 sm:px-6">
      <PageSubtitle title="CTPAT" description="Inspecciones CTPAT">
        <Button asChild>
          <Link href="/dashboard/settings/members/new">Nueva Inspección</Link>
        </Button>
      </PageSubtitle>
      <div className="mt-6"></div>
    </div>
  )
}
