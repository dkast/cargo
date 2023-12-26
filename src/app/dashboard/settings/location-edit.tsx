"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { type Prisma } from "@prisma/client"
import { Edit, Loader2 } from "lucide-react"
import { useAction } from "next-safe-action/hook"
import { type z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { updateLocation } from "@/server/actions/location"
import { type getLocations } from "@/server/fetchers"
import { locationSchema } from "@/lib/types"
import { useMobile } from "@/lib/use-mobile"

export default function LocationEdit({
  data
}: {
  data: Prisma.PromiseReturnType<typeof getLocations>[number]
}) {
  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      id: data.id,
      name: data.name,
      description: data.description || "",
      isActive: data.isActive,
      organizationId: data.organizationId
    }
  })
  const isMobile = useMobile()
  const [open, setOpen] = useState(false)

  const { execute, status, reset } = useAction(updateLocation, {
    onSuccess: data => {
      if (data?.success) {
        toast.success("Ubicación actualizada")
        setOpen(false)
      } else if (data?.failure.reason) {
        toast.error(data.failure.reason)
      }
      reset()
    },
    onError: () => {
      toast.error("Algo salió mal")
      reset()
    }
  })

  const onSubmit = async (data: z.infer<typeof locationSchema>) => {
    console.log(data)
    await execute({
      id: data.id,
      name: data.name,
      description: data.description,
      isActive: data.isActive,
      organizationId: data.organizationId
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="group">
          <Edit className="h-4 w-4 opacity-70 group-hover:opacity-100" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="h-[86%] sm:h-full"
      >
        <SheetHeader>
          <SheetTitle>Editar Ubicación</SheetTitle>
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
                  <FormLabel htmlFor="name">Ubicación</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ubicación"
                      {...field}
                    />
                  </FormControl>
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
                      id="description"
                      type="text"
                      placeholder="Descripción"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between gap-1 rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel htmlFor="isActive">Activa</FormLabel>
                    <FormDescription>
                      Ubicaciones inactivas no se podrán seleccionar en las
                      inspecciones
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      id="isActive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                  {"Guardando..."}
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
