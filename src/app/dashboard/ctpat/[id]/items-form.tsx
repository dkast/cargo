"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { InspectionResult, type Prisma } from "@prisma/client"
import { Camera, Check, X } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { type getInspectionById } from "@/server/fetchers"
import { inspectionItemSchema } from "@/lib/types"

const inspectionDetailSchema = z.object({
  items: z.array(inspectionItemSchema)
})

type Inspection = Prisma.PromiseReturnType<typeof getInspectionById>

export default function ItemsForm({ inspection }: { inspection: Inspection }) {
  const form = useForm<z.infer<typeof inspectionDetailSchema>>({
    resolver: zodResolver(inspectionDetailSchema),
    mode: "onChange",
    defaultValues: {
      items: inspection?.inspectionItems.map(item => ({
        ...item,
        notes: item.notes ?? ""
      }))
    }
  })

  const { fields } = useFieldArray({
    control: form.control,
    name: "items"
  })

  const onSubmit = async (data: z.infer<typeof inspectionDetailSchema>) => {
    console.log(data)
    console.log(inspectionDetailSchema.parse(data))
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
              className="border-200 space-y-4 rounded-md border bg-white px-3 py-4 shadow-sm"
            >
              <div className="flex flex-row flex-wrap items-center gap-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-sm text-white">
                  {index + 1}
                </span>
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
                            <div className="flex h-10 flex-row items-center gap-2 rounded-md border px-3 ring-2 ring-white">
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
                            <div className="flex h-10 flex-row items-center gap-2 rounded-md border px-3 ring-2 ring-white">
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
                          className="min-h-[60px]"
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
          <Button type="submit" className="w-full">
            Finalizar inspección
          </Button>
        </form>
        <DevTool control={form.control} />
      </Form>
    </div>
  )
}
