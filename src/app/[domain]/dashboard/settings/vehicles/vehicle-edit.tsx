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
import { createVehicle, updateVehicle } from "@/server/actions/vehicle"
import { actionType, vehicleSchema } from "@/lib/types"
import { useMobile } from "@/lib/use-mobile"

export default function VehicleEdit({
  organizationId,
  vehicle,
  action
}: {
  organizationId: string
  vehicle?: z.infer<typeof vehicleSchema>
  action: actionType
}) {
  const form = useForm<z.infer<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      id: vehicle?.id ?? "",
      vehicleNbr: vehicle?.vehicleNbr ?? "",
      licensePlate: vehicle?.licensePlate ?? "",
      organizationId
    }
  })

  const [open, setOpen] = useState(false)
  const isMobile = useMobile()

  // Focus on first field of the form
  useEffect(() => {
    form.setFocus("vehicleNbr")
  })

  const {
    execute: executeInsert,
    status: statusInsert,
    reset: resetInsert
  } = useAction(createVehicle, {
    onSuccess: data => {
      if (data?.success) {
        form.reset()
        toast.success("Unidad agregada correctamente")
        setOpen(false)
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
  } = useAction(updateVehicle, {
    onSuccess: data => {
      if (data?.success) {
        form.reset()
        toast.success("Unidad actualizada correctamente")
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

  const onSubmit = async (data: z.infer<typeof vehicleSchema>) => {
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
          <Button>Agregar unidad</Button>
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
            {action === actionType.CREATE ? "Agregar unidad" : "Editar unidad"}
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            className="mt-10 space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="vehicleNbr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="vehicleNbr">Unidad</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Unidad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="licensePlate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="licensePlate">
                    Número de licencia
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Número de placas"
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
