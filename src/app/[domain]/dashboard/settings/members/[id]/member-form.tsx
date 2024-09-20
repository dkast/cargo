"use client"

import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { MembershipRole } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { createOrgMember, updateOrgMember } from "@/server/actions/organization"
import { actionType, userMemberSchema } from "@/lib/types"
import { getTimezones } from "@/lib/utils"

type UserMemberFormValues = z.infer<typeof userMemberSchema>

export default function MemberForm({
  action,
  member
}: {
  action: actionType
  member: Partial<UserMemberFormValues>
}) {
  const router = useRouter()
  const timezones = getTimezones()

  const form = useForm<z.infer<typeof userMemberSchema>>({
    resolver: zodResolver(userMemberSchema),
    defaultValues: {
      ...member,
      timezone:
        member.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    mode: "onChange"
  })

  const {
    execute: createMember,
    status: createStatus,
    reset
  } = useAction(createOrgMember, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Usuario creado")
        router.push(".")
      } else if (data?.failure?.reason) {
        toast.error(data.failure.reason)
      }
      // Reset response object
      reset()
    },
    onError: () => {
      toast.error("Algo salió mal")

      // Reset response object
      reset()
    }
  })

  const {
    execute: updateMember,
    status: updateStatus,
    reset: resetUpdate
  } = useAction(updateOrgMember, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Usuario actualizado")
      } else if (data?.failure?.reason) {
        toast.error(data.failure.reason)
      }

      // Reset response object
      resetUpdate()

      router.push(".")
    },
    onError: () => {
      toast.error("Algo salio mal")

      // Reset response object
      resetUpdate()
    }
  })

  const onSubmit = async (data: z.infer<typeof userMemberSchema>) => {
    if (action === actionType.CREATE) {
      await createMember(data)
    } else {
      await updateMember(data)
    }
  }

  return (
    <Form {...form}>
      <form className="mt-10 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Nombre</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Nombre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="username">Nombre de usuario</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Nombre de usuario"
                  {...field}
                  className="sm:w-1/2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Email"
                  {...field}
                  className="sm:w-1/2"
                  disabled={action === actionType.UPDATE}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password">Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Contraseña"
                  {...field}
                  className="sm:w-1/2"
                />
              </FormControl>
              <FormDescription>
                La contraseña debe tener al menos 8 caracteres
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="confirmPassword">
                Confirmar contraseña
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirmar contraseña"
                  {...field}
                  className="sm:w-1/2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="timezone">Zona Horaria</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="sm:w-1/3">
                    <SelectValue placeholder="Seleccione la zona horaria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {timezones.map(timezone => (
                    <SelectItem key={timezone} value={timezone}>
                      {timezone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                La zona horaria determina la hora en la que se mostrarán los
                datos de los reportes e inspecciones. Por defecto se selecciona
                la zona horaria del navegador.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="role">Rol</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="sm:w-1/3">
                    <SelectValue placeholder="Seleccione el rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={MembershipRole.OWNER}>
                    Propietario
                  </SelectItem>
                  <SelectItem value={MembershipRole.SUPERVISOR}>
                    Supervisor
                  </SelectItem>
                  <SelectItem value={MembershipRole.MEMBER}>Miembro</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                El rol determina los permisos que tendrá el usuario
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border p-4 dark:border-gray-800">
              <div className="space-y-0.5">
                <FormLabel htmlFor="isActive">Cuenta activa</FormLabel>
                <FormDescription>
                  Usuarios inactivos no pueden acceder a la aplicación. Al
                  desactivar un usuario los datos generado por el mismo no se
                  eliminarán.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  id="isActive"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-start gap-x-2 pt-6">
          <Button
            type="submit"
            disabled={
              createStatus === "executing" || updateStatus === "executing"
            }
          >
            {createStatus === "executing" || updateStatus === "executing" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                {"Guardando..."}
              </>
            ) : (
              "Guardar"
            )}
          </Button>
          <Button variant="outline" asChild>
            <Link href=".">Cancelar</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}
