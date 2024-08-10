"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, Loader2 } from "lucide-react"
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
import { createContainer, updateContainer } from "@/server/actions/container"
import { actionType, containerSchema } from "@/lib/types"
import { useMobile } from "@/lib/use-mobile"

export default function ContainerEdit({
  organizationId,
  container,
  action
}: {
  organizationId: string
  container?: z.infer<typeof containerSchema>
  action: actionType
}) {
  const form = useForm<z.infer<typeof containerSchema>>({
    resolver: zodResolver(containerSchema),
    defaultValues: {
      id: container?.id ?? "",
      containerNbr: container?.containerNbr ?? "",
      organizationId
    }
  })

  const [open, setOpen] = useState(false)
  const isMobile = useMobile()

  // Focus on first field of the form
  useEffect(() => {
    form.setFocus("containerNbr")
  })

  const {
    execute: executeInsert,
    status: statusInsert,
    reset: resetInsert
  } = useAction(createContainer, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        form.reset()
        toast.success("Contenedor agregado correctamente")
        setOpen(false)
      } else if (data?.failure?.reason) {
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
  } = useAction(updateContainer, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Contenedor actualizado correctamente")
        setOpen(false)
        form.reset()
      } else if (data?.failure?.reason) {
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

  const onSubmit = async (data: z.infer<typeof containerSchema>) => {
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
          <Button>Agregar contenedor</Button>
        ) : (
          <Button variant="ghost" size="icon" className="group">
            <Edit className="h-4 w-4 opacity-70 group-hover:opacity-100" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="h-[86%] sm:h-full"
      >
        <SheetHeader>
          <SheetTitle>
            {action === actionType.CREATE
              ? "Agregar contenedor"
              : "Editar contenedor"}
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            className="mt-10 space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="containerNbr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="containerNbr">Contenedor</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Contenedor" {...field} />
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
