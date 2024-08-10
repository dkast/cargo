"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, PlusIcon } from "lucide-react"
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { createOperator } from "@/server/actions/operator"
import { operatorSchema } from "@/lib/types"
import { useMobile } from "@/lib/use-mobile"

export function AddOperatorForm({
  organizationId
}: {
  organizationId: string
}) {
  const form = useForm<z.infer<typeof operatorSchema>>({
    resolver: zodResolver(operatorSchema),
    defaultValues: {
      name: "",
      licenseNumber: "",
      organizationId
    }
  })
  const [open, setOpen] = useState(false)
  const isMobile = useMobile()

  // Focus on first field of the form
  useEffect(() => {
    form.setFocus("name")
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const { execute, status, reset } = useAction(createOperator, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Operador agregado correctamente")
        setOpen(false)
      } else if (data?.failure?.reason) {
        toast.error(data.failure.reason)
      }
      reset()
    }
  })

  const onSubmit = async (data: z.infer<typeof operatorSchema>) => {
    await execute(data)
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="xs" className="w-full">
          <PlusIcon className="mr-2 h-4 w-4" />
          Agregar
        </Button>
      </SheetTrigger>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="h-[86%] sm:h-full"
      >
        <SheetHeader>
          <SheetTitle>Agregar Operador</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form className="mt-10 space-y-6">
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
            <Button
              disabled={status === "executing"}
              onClick={form.handleSubmit(onSubmit)}
              className="w-full"
            >
              {status === "executing" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  {"Agregando..."}
                </>
              ) : (
                "Agregar"
              )}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
