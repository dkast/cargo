"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { MapPin } from "lucide-react"
import { type z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { locationSchema } from "@/lib/types"

export default function LocationForm({
  organizationId
}: {
  organizationId: string
}) {
  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      organizationId: organizationId
    }
  })

  const onSubmit = (data: z.infer<typeof locationSchema>) => {
    console.log(data)
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-10 space-y-6"
        >
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
                <FormLabel htmlFor="description">Descripción</FormLabel>
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
          <Button type="submit">Guardar</Button>
        </form>
      </Form>
      <Card className="mt-10">
        <CardHeader title="Ubicaciones">
          <CardTitle className="text-base">Lista de ubicaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState />
        </CardContent>
      </Card>
    </>
  )
}

// Empty state

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center">
      <MapPin className="h-10 w-10 rounded-xl bg-orange-100 p-2 text-orange-400" />
      <span className="mt-2 text-gray-500">No hay ubicaciones</span>
    </div>
  )
}
