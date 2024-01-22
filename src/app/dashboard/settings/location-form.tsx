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
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createLocation } from "@/server/actions/location"
import { locationSchema } from "@/lib/types"

export default function LocationForm({
  organizationId
}: {
  organizationId: string
}) {
  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      organizationId: organizationId
    }
  })

  const { isDirty } = form.formState

  const { execute, status, reset } = useAction(createLocation, {
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

  const onSubmit = async (data: z.infer<typeof locationSchema>) => {
    console.log(data)
    if (!isDirty) return

    await execute(data)
    form.reset({
      name: "",
      description: "",
      isActive: true,
      organizationId: organizationId
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Nombre de la ubicación</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  id="name"
                  placeholder="Nombre de la ubicación"
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
              <FormLabel htmlFor="description">
                Descripción (opcional)
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  id="description"
                  placeholder="Descripción"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={status === "executing"} type="submit">
          {status === "executing" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {"Guardando..."}
            </>
          ) : (
            "Guardar"
          )}
        </Button>
      </form>
    </Form>
  )
}
