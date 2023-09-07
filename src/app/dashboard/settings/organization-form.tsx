"use client"

import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { type Organization } from "@prisma/client"
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
import { updateOrganization } from "@/server/actions/organization"
import { orgSchema } from "@/lib/types"

export default function OrganizationForm({ data }: { data: Organization }) {
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
  const { isDirty, isSubmitting } = form.formState

  const { execute } = useAction(updateOrganization, {
    onSuccess: data => {
      if (data?.success) {
        toast.success("Datos actualizados")
      } else if (data?.failure) {
        toast.error(data.failure.reason!)
      }
    },
    onError: () => {
      toast.error("Algo salio mal")
    }
  })

  const onSubmit = async (data: z.infer<typeof orgSchema>) => {
    if (!isDirty) return

    console.log(data)
    execute(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Nombre de la empresa</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la empresa" {...field} />
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
                <Input placeholder="Descripción" {...field} />
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
                <Input disabled placeholder="Subdominio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-start pt-6">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
