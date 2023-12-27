"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, Loader2 } from "lucide-react"
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { createCompany, updateCompany } from "@/server/actions/company"
import { actionType, companySchema } from "@/lib/types"

export default function TransportEdit({
  organizationId,
  company,
  action
}: {
  organizationId: string
  company?: z.infer<typeof companySchema>
  action: actionType
}) {
  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      id: company?.id ?? "",
      name: company?.name ?? "",
      organizationId
    }
  })

  const [open, setOpen] = useState(false)

  const {
    execute: executeInsert,
    status: statusInsert,
    reset: resetInsert
  } = useAction(createCompany, {
    onSuccess: data => {
      if (data?.success) {
        toast.success("Transportista agregado correctamente")
      } else if (data?.failure.reason) {
        toast.error(data.failure.reason)
      }

      // Reset response object
      resetInsert()
    },
    onError: () => {
      toast.error("Algo salio mal")

      // Reset response object
      resetInsert()
    }
  })

  const {
    execute: executeUpdate,
    status: statusUpdate,
    reset: resetUpdate
  } = useAction(updateCompany, {
    onSuccess: data => {
      if (data?.success) {
        toast.success("Transportista actualizado correctamente")
        setOpen(false)
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

  const onSubmit = async (data: z.infer<typeof companySchema>) => {
    console.log(data)
    if (action === actionType.CREATE) {
      await executeInsert(data)
    }

    if (action === actionType.UPDATE) {
      await executeUpdate(data)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {action === actionType.CREATE ? (
          <Button>Agregar transportista</Button>
        ) : (
          <Button variant="ghost" size="icon" className="group">
            <Edit className="h-4 w-4 opacity-70 group-hover:opacity-100" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {action === actionType.CREATE
              ? "Agregar transportista"
              : "Editar transportista"}
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            className="mt-10 space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Transportista</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Nombre del Transportista"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={
                statusInsert === "executing" || statusUpdate === "executing"
              }
              onClick={form.handleSubmit(onSubmit)}
              className="w-full"
            >
              {statusInsert === "executing" || statusUpdate === "executing" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  {"Guardarando..."}
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
