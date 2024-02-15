"use client"

import { memo } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { type Prisma } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { type z } from "zod"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { updateOrgMember } from "@/server/actions/organization"
import type { getUserMemberships } from "@/server/fetchers"
import { userMemberSchema } from "@/lib/types"
import { getInitials } from "@/lib/utils"

type UserMemberFormValues = z.infer<typeof userMemberSchema>

export default function ProfileForm({
  member,
  memberships
}: {
  member: Partial<UserMemberFormValues>
  memberships: Prisma.PromiseReturnType<typeof getUserMemberships>
}) {
  const form = useForm<z.infer<typeof userMemberSchema>>({
    resolver: zodResolver(userMemberSchema),
    defaultValues: member
  })

  const {
    execute: updateMember,
    status: updateStatus,
    reset: resetUpdate
  } = useAction(updateOrgMember, {
    onSuccess: data => {
      if (data?.success) {
        toast.success("Datos actualizados")
      } else if (data?.failure.reason) {
        toast.error(data.failure.reason)
      }

      // Reset response object
      resetUpdate()
    },
    onError: () => {
      toast.error("Algo salio mal")

      // Reset response object
      resetUpdate()
    }
  })

  const onSubmit = async (data: z.infer<typeof userMemberSchema>) => {
    await updateMember(data)
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
                  disabled
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
                  disabled
                  placeholder="Email"
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
          name="defaultMembershipId"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="role">Organización Primaria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar organización" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {memberships.map(membership => (
                    <SelectItem key={membership.id} value={membership.id}>
                      <div className="flex w-full flex-row items-center gap-x-2">
                        <OrgAvatar
                          imageURL={membership.organization.image ?? ""}
                          name={membership.organization.name}
                        />
                        <span>{membership.organization.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-start gap-x-2 pt-6">
          <Button type="submit" disabled={updateStatus === "executing"}>
            {updateStatus === "executing" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                {"Guardando..."}
              </>
            ) : (
              "Guardar"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

const OrgAvatar = memo(function OrgAvatar({
  imageURL,
  name
}: {
  imageURL: string
  name: string
}) {
  return (
    <Avatar className="size-6 rounded shadow">
      <AvatarImage src={imageURL} />
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  )
})
