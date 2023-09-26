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
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { createCompany } from "@/server/actions/company"
import { operatorSchema, vehicleSchema, type companySchema } from "@/lib/types"
import { cn } from "@/lib/utils"
import { AddOperatorForm } from "./add-operator-form"

const ctpatMainSchema = z.object({
  company: z.string({
    required_error: "Este campo es requerido"
  }),
  operator: z.string({
    required_error: "Este campo es requerido"
  }),
  licenseNumber: z.string({
    required_error: "Este campo es requerido"
  }),
  vehicle: z.string({
    required_error: "Este campo es requerido"
  }),
  licensePlate: z.string({
    required_error: "Este campo es requerido"
  })
})

export default function CTPATMainForm({
  companies,
  operators,
  vehicles,
  organizationId
}: {
  companies: z.infer<typeof companySchema>[]
  operators: z.infer<typeof operatorSchema>[]
  vehicles: z.infer<typeof vehicleSchema>[]
  organizationId: string
}) {
  const [searchCompany, setSearchCompany] = useState<string>("")
  const form = useForm<z.infer<typeof ctpatMainSchema>>({
    resolver: zodResolver(ctpatMainSchema),
    defaultValues: {
      company: "",
      operator: "",
      licenseNumber: "",
      vehicle: "",
      licensePlate: ""
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

  const handleAddOperator = () => {
    console.log("add operator")
  }

  return (
    <Form {...form}>
      <form className="mt-10 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Company */}
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel htmlFor="company">Compañía de Transporte</FormLabel>
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
                        : "Seleccionar Compañía"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full min-w-[350px] p-0 sm:w-[400px]">
                  <Command>
                    <CommandInput
                      value={searchCompany}
                      onValueChange={setSearchCompany}
                      placeholder="Buscar Compañía..."
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
        {/* Operator */}
        <FormField
          control={form.control}
          name="operator"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel htmlFor="operator">Operador</FormLabel>
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
                        ? operators.find(
                            operator => operator.id === field.value
                          )?.name
                        : "Seleccionar Operador"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full min-w-[350px] p-0 sm:w-[400px]">
                  <Command>
                    <CommandInput placeholder="Buscar operador..."></CommandInput>
                    <CommandList>
                      <CommandEmpty className="px-2">
                        <AddOperatorForm organizationId={organizationId} />
                      </CommandEmpty>
                      <CommandGroup>
                        {operators.map(operator => (
                          <CommandItem
                            value={operator.name}
                            key={operator.id}
                            onSelect={() => {
                              form.setValue("operator", operator.id!)
                              form.setValue(
                                "licenseNumber",
                                operator.licenseNumber!
                              )
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                operator.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {operator.name}
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
        <FormField
          control={form.control}
          name="licenseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="licenseNumber">Número de Licencia</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Número de Licencia"
                  className="sm:w-1/2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Vehicle */}
        <Separator />
        <FormField
          control={form.control}
          name="vehicle"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel htmlFor="vehicle">Unidad</FormLabel>
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
                        ? vehicles.find(vehicle => vehicle.id === field.value)
                            ?.vehicleNbr
                        : "Seleccionar Unidad"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full min-w-[350px] p-0 sm:w-[400px]">
                  <Command>
                    <CommandInput placeholder="Buscar unidad..."></CommandInput>
                    <CommandList>
                      <CommandEmpty className="px-2">
                        <Button
                          variant="secondary"
                          className="w-full"
                          onClick={handleAddOperator}
                        >
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Agregar
                        </Button>
                      </CommandEmpty>
                      <CommandGroup>
                        {vehicles.map(vehicle => (
                          <CommandItem
                            value={vehicle.vehicleNbr}
                            key={vehicle.id}
                            onSelect={() => {
                              form.setValue("vehicle", vehicle.id!)
                              form.setValue(
                                "licensePlate",
                                vehicle.licensePlate!
                              )
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                vehicle.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {vehicle.vehicleNbr}
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
