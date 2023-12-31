"use client"

import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { type Organization } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useAction } from "next-safe-action/hook"
import { type z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { updateOrg } from "@/server/actions/organization"
import { orgSchema } from "@/lib/types"

export default function OrganizationForm({
  data,
  enabled
}: {
  data: Organization
  enabled: boolean
}) {
  const form = useForm<z.infer<typeof orgSchema>>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      id: data.id,
      name: data.name,
      description: data.description ?? undefined,
      subdomain: data.subdomain
    }
  })
  // Get state from form
  const { isDirty } = form.formState

  const { execute, status, reset } = useAction(updateOrg, {
    onSuccess: data => {
      if (data?.success) {
        toast.success("Datos actualizados")
      } else if (data?.failure.reason) {
        toast.error(data.failure.reason)
      }

      // Reset response object
      reset()
    },
    onError: () => {
      toast.error("Algo salio mal")

      // Reset response object
      reset()
    }
  })

  const onSubmit = async (data: z.infer<typeof orgSchema>) => {
    if (!isDirty) return

    await execute(data)
    form.reset(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={!enabled} className="mt-10 space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">Nombre de la empresa</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Nombre de la empresa"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="description">Descripción</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Descripción" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subdomain"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="subdomain">Subdominio</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    disabled
                    placeholder="Subdominio"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-start pt-6">
            <Button disabled={status === "executing"} type="submit">
              {status === "executing" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  {"Guardando..."}
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  )
}
