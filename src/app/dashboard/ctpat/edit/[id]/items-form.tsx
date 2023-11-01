"use client"

import { useFieldArray, useForm } from "react-hook-form"
import toast from "react-hot-toast"
// import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { InspectionResult, type Prisma } from "@prisma/client"
import { Camera, Check, Loader2, X } from "lucide-react"
import { useAction } from "next-safe-action/hook"
import { useRouter } from "next/navigation"
import { type z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { closeCTPATInspection } from "@/server/actions/ctpat"
import { type getInspectionById } from "@/server/fetchers"
import { inspectionDetailSchema } from "@/lib/types"

type Inspection = Prisma.PromiseReturnType<typeof getInspectionById>

export default function ItemsForm({ inspection }: { inspection: Inspection }) {
  const form = useForm<z.infer<typeof inspectionDetailSchema>>({
    resolver: zodResolver(inspectionDetailSchema),
    mode: "onChange",
    defaultValues: {
      id: inspection?.id,
      items: inspection?.inspectionItems.map(item => ({
        ...item,
        notes: item.notes ?? ""
      })),
      isLoaded: inspection?.isLoaded ?? false,
      sealNbr: inspection?.sealNbr ?? "",
      tiresVehicle: inspection?.tiresVehicle ?? "",
      tiresContainer: inspection?.tiresContainer ?? "",
      organizationId: inspection?.organizationId
    }
  })

  const router = useRouter()

  const { fields } = useFieldArray({
    control: form.control,
    name: "items"
  })

  const {
    execute: updateInspection,
    status: updateStatus,
    reset
  } = useAction(closeCTPATInspection, {
    onSuccess: data => {
      if (data?.success) {
        toast.success("Inspección actualizada")
      } else if (data?.failure) {
        toast.error(data.failure.reason!)
      }

      reset()

      router.push("/dashboard/inspect")
    },
    onError: () => {
      toast.error("Algo salío mal")

      reset()
    }
  })

  const onSubmit = async (data: z.infer<typeof inspectionDetailSchema>) => {
    updateInspection(data)
  }

  return (
    <div className="mx-auto my-4 max-w-2xl grow">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4 px-2 sm:px-0"
        >
          {fields.map((fieldItem, index) => (
            <div
              key={fieldItem.id}
              className="border-200 space-y-4 rounded-lg border bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex flex-row flex-wrap items-center gap-3">
                {index < 17 && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-50  text-sm text-violet-700 ring-1 ring-inset ring-violet-700/10">
                    {index + 1}
                  </span>
                )}
                <span className="grow">{fieldItem.question}</span>
                <FormField
                  key={fieldItem.id}
                  name={`items.${index}.result`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:col-span-3">
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-2"
                      >
                        <FormItem>
                          <FormLabel className="[&:has([data-state=checked])>div]:border-green-500 [&:has([data-state=checked])>div]:text-green-700 [&:has([data-state=checked])>div]:ring-green-200">
                            <FormControl>
                              <RadioGroupItem
                                value={InspectionResult.PASS}
                                className="sr-only"
                              />
                            </FormControl>
                            <div className="flex h-10 flex-row items-center gap-2 rounded-lg border px-2 text-gray-500 ring-2 ring-white">
                              <Check className="h-4 w-4" />
                              OK
                            </div>
                          </FormLabel>
                        </FormItem>
                        <FormItem>
                          <FormLabel className="[&:has([data-state=checked])>div]:border-red-500 [&:has([data-state=checked])>div]:text-red-700 [&:has([data-state=checked])>div]:ring-red-200">
                            <FormControl>
                              <RadioGroupItem
                                value={InspectionResult.FAIL}
                                className="sr-only"
                              />
                            </FormControl>
                            <div className="flex h-10 flex-row items-center gap-2 rounded-lg border px-2 text-gray-500 ring-2 ring-white">
                              <X className="h-4 w-4" />
                              NOK
                            </div>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Comments and photos */}
              <div className="flex flex-row items-start gap-2">
                <FormField
                  key={fieldItem.id}
                  name={`items.${index}.notes`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormControl>
                        <Textarea
                          className="h-[40px] min-h-[40px]"
                          placeholder="Comentarios"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button variant="ghost" size="icon">
                  <Camera className="h-6 w-6" />
                </Button>
              </div>
            </div>
          ))}
          <div className="border-200 space-y-6 rounded-lg border bg-white px-4 py-6 shadow-sm">
            <FormField
              control={form.control}
              name="sealNbr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="sealNbr">Sello de Seguridad</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Sello de Seguridad"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Número de sello de seguridad si está cargado
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tiresVehicle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="tiresVehicle">
                    Marcado de Llantas Tractor
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Marcado de Llantas Tractor"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tiresContainer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="tiresContainer">
                    Marcado de Llantas de Caja
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Marcado de Llantas de Caja"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={updateStatus === "executing"}
          >
            {updateStatus === "executing" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {"Guardando..."}
              </>
            ) : (
              "Finalizar inspección"
            )}
          </Button>
        </form>
        {/* <DevTool control={form.control} /> */}
      </Form>
    </div>
  )
}
