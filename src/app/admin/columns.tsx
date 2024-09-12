import {
  OrganizationPlan,
  OrganizationStatus,
  type Organization
} from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: "name",
    header: "Organización"
  },
  {
    accessorKey: "description",
    header: "Descripción"
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const organization = row.original
      return (
        <>
          {(() => {
            switch (organization.status) {
              case OrganizationStatus.ACTIVE:
                return <Badge variant="green">Activo</Badge>
              case OrganizationStatus.DUE:
                return <Badge variant="yellow">Vencido</Badge>
              case OrganizationStatus.INACTIVE:
                return <Badge variant="destructive">Inactivo</Badge>
              default:
                return <Badge variant="default">Desconocido</Badge>
            }
          })()}
        </>
      )
    }
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => {
      const organization = row.original
      return (
        <>
          {(() => {
            switch (organization.plan) {
              case OrganizationPlan.TRIAL:
                return <Badge variant="blue">Prueba</Badge>
              case OrganizationPlan.BASIC:
                return <Badge variant="green">Básico</Badge>
              case OrganizationPlan.PRO:
                return <Badge variant="yellow">Pro</Badge>
              case OrganizationPlan.ENTERPRISE:
                return <Badge variant="violet">Enterprise</Badge>
              default:
                return <Badge variant="default">Desconocido</Badge>
            }
          })()}
        </>
      )
    }
  },
  {
    accessorKey: "subdomain",
    header: "Subdominio"
  },
  {
    accessorKey: "createdAt",
    header: "Desde",
    cell: ({ row }) => {
      const organization = row.original
      return new Date(organization.createdAt).toLocaleDateString()
    }
  }
]
