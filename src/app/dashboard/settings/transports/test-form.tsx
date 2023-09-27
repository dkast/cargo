"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import {
  ComboBox,
  ComboBoxEmpty,
  ComboBoxGroup,
  ComboBoxInput,
  ComboBoxItem,
  ComboBoxList
} from "@/app/dashboard/settings/transports/combobox"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { type companySchema } from "@/lib/types"
import { cn } from "@/lib/utils"

const testSchema = z.object({
  company: z.string()
})

export default function TestForm({
  companies
}: {
  companies: z.infer<typeof companySchema>[]
}) {
  const form = useForm<z.infer<typeof testSchema>>({
    resolver: zodResolver(testSchema),
    defaultValues: { company: "" }
  })
  const [open, setOpen] = useState(false)

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <ComboBox
                open={open}
                setOpen={setOpen}
                trigger={
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between sm:w-[300px]",
                        !field.value && "text-gray-500 dark:text-gray-400"
                      )}
                    >
                      {field.value
                        ? companies.find(company => company.id === field.value)
                            ?.name
                        : "Seleccionar Compañía"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                }
              >
                <ComboBoxInput placeholder="Buscar..." />
                <ComboBoxList>
                  <ComboBoxEmpty className="px-2">
                    No se encontraron resultados
                  </ComboBoxEmpty>
                  <ComboBoxGroup>
                    {companies.map(company => (
                      <ComboBoxItem
                        value={company.name}
                        key={company.id}
                        onSelect={() => {
                          form.setValue("company", company.id!)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            company.id === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {company.name}
                      </ComboBoxItem>
                    ))}
                  </ComboBoxGroup>
                </ComboBoxList>
              </ComboBox>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
