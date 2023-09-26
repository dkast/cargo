"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "lucide-react"
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger
} from "@/components/ui/sheet"
import { operatorSchema } from "@/lib/types"
import { useMobile } from "@/lib/use-mobile"

export function AddOperator() {
  const form = useForm<z.infer<typeof operatorSchema>>({
    resolver: zodResolver(operatorSchema),
    defaultValues: {
      name: "",
      licenseNumber: "",
      organizationId: ""
    }
  })
  const isMobile = useMobile()
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" className="w-full">
          <PlusIcon className="mr-2 h-4 w-4" />
          Agregar
        </Button>
      </SheetTrigger>
      <SheetContent side={isMobile ? "bottom" : "right"}>
        <SheetHeader>Agregar Operador</SheetHeader>
        <Form {...form}>
          <form
            className="mt-10 space-y-6"
            onSubmit={form.handleSubmit(data => {
              console.log(data)
            })}
          >
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
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="licenseNumber">
                    Número de Licencia
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Número de Licencia"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Agregar
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
