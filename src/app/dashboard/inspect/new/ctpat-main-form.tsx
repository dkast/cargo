"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Loader2, PlusIcon } from "lucide-react"
import { useAction } from "next-safe-action/hook"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { createCompany } from "@/server/actions/inspection"
import { type companySchema } from "@/lib/types"
import { cn } from "@/lib/utils"

const ctpatMainSchema = z.object({
  company: z.string({
    required_error: "Este campo es requerido"
  })
})

export default function CTPATMainForm({
  companies,
  organizationId
}: {
  companies: z.infer<typeof companySchema>[]
  organizationId: string
}) {
  const [searchCompany, setSearchCompany] = useState<string>("")
  const form = useForm<z.infer<typeof ctpatMainSchema>>({
    resolver: zodResolver(ctpatMainSchema),
    defaultValues: {
      company: ""
    },
    mode: "onChange"
  })

  const {
    execute: insertCompany,
    isExecuting: isInserting,
    reset
  } = useAction(createCompany, {
    onSuccess: data => {
      if (data?.failure) {
        toast.error(data.failure.reason!)
      }
      reset()
    },
    onError: () => {
      toast.error("Algo salió mal")
      reset()
    }
  })

  const onSubmit = (data: z.infer<typeof ctpatMainSchema>) => {
    console.log(data)
  }

  const handleAddCompany = () => {
    console.log("add company " + searchCompany)
    const payload: z.infer<typeof companySchema> = {
      name: searchCompany,
      organizationId
    }
    insertCompany(payload)
  }

  return (
    <Form {...form}>
      <form className="mt-10 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel htmlFor="company">Compañía</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between sm:w-[400px]",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? companies.find(company => company.id === field.value)
                            ?.name
                        : "Seleccionar compañía"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full min-w-[350px] p-0 sm:w-[400px]">
                  <Command>
                    <CommandInput
                      value={searchCompany}
                      onValueChange={setSearchCompany}
                      placeholder="Buscar compañía..."
                    />
                    <CommandList>
                      <CommandEmpty className="px-2">
                        <Button
                          disabled={isInserting}
                          variant="secondary"
                          className="w-full"
                          onClick={handleAddCompany}
                        >
                          {isInserting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <PlusIcon className="mr-2 h-4 w-4" />
                          )}
                          {searchCompany
                            ? `Agregar "${searchCompany}"`
                            : "Agregar"}
                        </Button>
                      </CommandEmpty>
                      <CommandGroup>
                        {companies.map(company => (
                          <CommandItem
                            value={company.name}
                            key={company.id}
                            onSelect={() => {
                              // console.log(company)
                              form.setValue("company", company.id!)
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
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
