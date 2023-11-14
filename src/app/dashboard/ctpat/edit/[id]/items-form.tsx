"use client"

import { useEffect, useState } from "react"
import {
  useFieldArray,
  useForm,
  type UseFormSetValue,
  type Control,
  type FieldArrayWithId
} from "react-hook-form"
import toast from "react-hot-toast"
import ItemMediaPreview from "@/app/dashboard/ctpat/edit/[id]/item-media-preview"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InspectionResult,
  type InspectionItemFile,
  type Prisma
} from "@prisma/client"
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog"
import {
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Loader2,
  X
} from "lucide-react"
import { useAction } from "next-safe-action/hook"
import { notFound, useRouter } from "next/navigation"
import { type z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
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
import { ItemFileUploader } from "./item-file-uploader"

type Inspection = Prisma.PromiseReturnType<typeof getInspectionById>

export default function ItemsForm({ inspection }: { inspection: Inspection }) {
  const form = useForm<z.infer<typeof inspectionDetailSchema>>({
    resolver: zodResolver(inspectionDetailSchema),
    mode: "onChange",
    defaultValues: {
      id: inspection?.id,
      items: inspection?.inspectionItems.map(item => ({
        ...item,
        notes: item.notes ?? "",
        fileCount: item.inspectionItemFiles?.length ?? 0
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
      } else if (data?.failure.reason) {
        toast.error(data.failure.reason)
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

  if (!inspection) return notFound()

  return (
    <div className="mx-auto my-4 max-w-2xl grow">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4 px-2 sm:px-0"
        >
          {fields.map((fieldItem, index) => {
            // Set the file count
            // form.setValue(
            //   `items.${index}.fileCount`,
            //   inspection.inspectionItems[index]?.inspectionItemFiles.length ?? 0
            // )
            return (
              <ItemQuestion
                organizationId={inspection.organizationId}
                inspectionItemId={inspection.inspectionItems[index]?.id}
                key={fieldItem.id}
                index={index}
                fieldItem={fieldItem}
                control={form.control}
                setValue={form.setValue}
                fileList={
                  inspection.inspectionItems[index]?.inspectionItemFiles
                }
              />
            )
          })}
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
        <DevTool control={form.control} />
      </Form>
    </div>
  )
}

function ItemQuestion({
  organizationId,
  inspectionItemId,
  index,
  fieldItem,
  control,
  setValue,
  fileList
}: {
  organizationId: string
  inspectionItemId: string | undefined
  index: number
  fieldItem: FieldArrayWithId<z.infer<typeof inspectionDetailSchema>>
  control: Control<z.infer<typeof inspectionDetailSchema>>
  setValue: UseFormSetValue<z.infer<typeof inspectionDetailSchema>>
  fileList: Partial<InspectionItemFile>[] | undefined
}) {
  const [open, setOpen] = useState(false)
  const invalid = control.getFieldState(`items.${index}.notes`).invalid
  const router = useRouter()

  // If there is an error, open the collapsible
  useEffect(() => {
    if (invalid) {
      setOpen(invalid)
    }
  }, [invalid])

  if (!organizationId) return null

  if (!inspectionItemId) return null

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="border-200 space-y-4 rounded-lg border bg-white px-4 py-3 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-row sm:items-center">
          <div className="flex grow items-center gap-x-3">
            {index < 17 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-50  text-sm text-violet-700 ring-1 ring-inset ring-violet-700/10">
                {index + 1}
              </span>
            )}
            <span>{fieldItem.question}</span>
          </div>
          <div className="flex items-center gap-x-1">
            <FormField
              key={fieldItem.id}
              name={`items.${index}.result`}
              control={control}
              render={({ field }) => (
                <FormItem className="grow sm:grow-0">
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 place-items-center gap-3"
                  >
                    <FormItem>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-green-500 [&:has([data-state=checked])>div]:text-green-700 [&:has([data-state=checked])>div]:ring-green-200">
                        <FormControl>
                          <RadioGroupItem
                            value={InspectionResult.PASS}
                            className="sr-only"
                          />
                        </FormControl>
                        <div className="flex flex-row items-center gap-2 rounded-full border p-2 text-gray-500 ring-2 ring-white">
                          <Check className="h-4 w-4" />
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
                        <div className="flex flex-row items-center gap-2 rounded-full border p-2 text-gray-500 ring-2 ring-white">
                          <X className="h-4 w-4" />
                        </div>
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon">
                {open ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent>
          {/* Comments and photos */}
          <div className="flex flex-row items-start gap-2">
            <FormField
              key={fieldItem.id}
              name={`items.${index}.notes`}
              control={control}
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
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant="ghost" size="icon">
                  <Camera className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Subir fotos</DialogTitle>
                </DialogHeader>
                <ItemFileUploader
                  organizationId={organizationId}
                  itemId={inspectionItemId}
                  onUploadSuccess={() => {
                    // Update the file count in the form so we can validate if a file is needed as evidence
                    setValue(
                      `items.${index}.fileCount`,
                      (fileList?.length ?? 0) + 1
                    )
                    router.refresh()
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CollapsibleContent>
        {fileList && fileList.length > 0 && (
          <ItemMediaPreview
            fileList={fileList}
            allowDelete
            // Update the file count in the form so we can validate if a file is needed as evidence
            onDeleteFile={() => {
              setValue(`items.${index}.fileCount`, (fileList?.length ?? 0) - 1)
            }}
          />
        )}
      </div>
    </Collapsible>
  )
}
