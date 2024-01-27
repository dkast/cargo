"use client"

import { MembershipRole, type Membership } from "@prisma/client"
import { type ColumnDef } from "@tanstack/react-table"
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  MoreHorizontal
} from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export const columns: ColumnDef<Membership>[] = [
  {
    accessorKey: "user.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          {{
            asc: <ChevronUp className="ml-2 h-4 w-4" />,
            desc: <ChevronDown className="ml-2 h-4 w-4" />
          }[column.getIsSorted() as string] ?? (
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    }
  },
  {
    accessorKey: "user.email",
    header: "Correo electrónico",
    enableHiding: true
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const membership = row.original
      const roleLabel = (() => {
        switch (membership.role) {
          case MembershipRole.ADMIN:
            return "Administrador"
          case MembershipRole.MEMBER:
            return "Miembro"
          case MembershipRole.SUPERVISOR:
            return "Supervisor"
          case MembershipRole.OWNER:
            return "Propietario"
          default:
            return ""
        }
      })()

      return <span className="text-sm text-gray-900">{roleLabel}</span>
    }
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => {
      const membership = row.original

      return (
        <Badge variant={membership.isActive ? "green" : "secondary"}>
          {membership.isActive ? "Activo" : "Inactivo"}
        </Badge>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const membership = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`members/${membership.id}`}>Editar</Link>
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              <span>Desactivar</span>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
