"use client"

import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
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
import { Separator } from "@/components/ui/separator"
import { updateOrgMember } from "@/server/actions/organization"
import { userMemberSchema } from "@/lib/types"

type UserMemberFormValues = z.infer<typeof userMemberSchema>

export default function ProfileForm({
  member
}: {
  member: Partial<UserMemberFormValues>
}) {
  const form = useForm<z.infer<typeof userMemberSchema>>({
    resolver: zodResolver(userMemberSchema),
    defaultValues: member,
    mode: "onChange"
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
