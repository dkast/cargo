"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type Company } from "@prisma/client"
import { ChevronsUpDown, PlusIcon } from "lucide-react"
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
import { cn } from "@/lib/utils"

const ctpatMainSchema = z.object({
  company: z.string({
    required_error: "Este campo es requerido"
  })
})

const onSubmit = (data: z.infer<typeof ctpatMainSchema>) => {
  console.log(data)
}

export default function CTPATMainForm() {
  const companies: Company[] = []
  const form = useForm<z.infer<typeof ctpatMainSchema>>({
    resolver: zodResolver(ctpatMainSchema),
    defaultValues: {
      company: ""
    },
    mode: "onChange"
  })
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
                        "w-[400px] justify-between",
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
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar compañía..." />
                    <CommandList>
                      <CommandEmpty className="px-2">
                        <Button variant="secondary" className="w-full">
                          <PlusIcon className="mr-2 h-5 w-5" />
                          Agregar compañía
                        </Button>
                      </CommandEmpty>
                      <CommandGroup>
                        {companies.map(company => (
                          <CommandItem
                            value={company.id}
                            key={company.id}
                            onClick={() => {
                              form.setValue("company", company.id)
                            }}
                          >
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
