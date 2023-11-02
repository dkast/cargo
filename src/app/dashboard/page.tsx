import { type Metadata } from "next"

import PageHeader from "@/components/dashboard/page-header"

export const metadata: Metadata = {
  title: "Inicio"
}

export default function DashboardPage() {
  return <PageHeader title="Bienvenido"></PageHeader>
}
