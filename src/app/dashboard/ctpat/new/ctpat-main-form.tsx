"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { AddVehicleForm } from "@/app/dashboard/ctpat/new/add-vehicle-form"
// import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { fromDate } from "@internationalized/date"
import { InspectionTripType } from "@prisma/client"
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Check,
  ChevronsUpDown,
  Loader2,
  PlusIcon
} from "lucide-react"
import { useAction } from "next-safe-action/hook"
import { redirect } from "next/navigation"
import { type z } from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ComboBox,
  ComboBoxEmpty,
  ComboBoxFooter,
  ComboBoxGroup,
  ComboBoxInput,
  ComboBoxItem,
  ComboBoxList
} from "@/components/ui/combobox"
import { DateTimePicker } from "@/components/ui/date-time-picker/date-time-picker"
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
import { Separator } from "@/components/ui/separator"
import { createCompany } from "@/server/actions/company"
import { createContainer } from "@/server/actions/container"
import { createCTPATInspection } from "@/server/actions/ctpat"
import {
  ctpatMainSchema,
  type companySchema,
  type containerSchema,
  type operatorSchema,
  type vehicleSchema
} from "@/lib/types"
import { cn } from "@/lib/utils"
import { AddOperatorForm } from "./add-operator-form"

export default function CTPATMainForm({
  companies,
  operators,
  vehicles,
  containers,
  organizationId,
  membershipId
}: {
  companies: z.infer<typeof companySchema>[]
  operators: z.infer<typeof operatorSchema>[]
  vehicles: z.infer<typeof vehicleSchema>[]
  containers: z.infer<typeof containerSchema>[]
  organizationId: string
  membershipId: string
}) {
  const [searchCompany, setSearchCompany] = useState<string>("")
  const [searchContainer, setsearchContainer] = useState("")
  const form = useForm<z.infer<typeof ctpatMainSchema>>({
    resolver: zodResolver(ctpatMainSchema),
    defaultValues: {
      isLoaded: false,
      inspectionStart: new Date(),
      inspectionTripType: "IN",
      organizationId,
      inspectedById: membershipId
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

  const handleAddCompany = () => {
    const payload: z.infer<typeof companySchema> = {
      name: searchCompany,
      organizationId
    }
    insertCompany(payload)
  }

  const {
    execute: insertContainer,
    isExecuting: isInsertingContainer,
    reset: resetContainer
  } = useAction(createContainer, {
    onSuccess: data => {
      if (data?.failure) {
        toast.error(data.failure.reason!)
      }
      resetContainer()
    },
    onError: () => {
      toast.error("Algo salió mal")
      resetContainer()
    }
  })

  const handleAddContainer = () => {
    const payload: z.infer<typeof containerSchema> = {
      containerNbr: searchContainer,
      organizationId
    }
    insertContainer(payload)
  }

  const {
    execute: insertInspection,
    isExecuting: isInsertingInspection,
    reset: resetInspection
  } = useAction(createCTPATInspection, {
    onSuccess: data => {
      if (data?.failure) {
        toast.error(data.failure.reason!)
      } else if (data?.success) {
        // toast.success("Iniciando inspección...")
        redirect(`/dashboard/ctpat/${data.success.inspectionId}`)
      }
      resetInspection()
    },
    onError: () => {
      toast.error("Algo salió mal")
      resetInspection()
    }
  })

  const onSubmit = async (data: z.infer<typeof ctpatMainSchema>) => {
    console.log(data)
    insertInspection(data)
  }

  return (
    <Form {...form}>
      <form
        className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Inspection Start */}
        <FormField
          control={form.control}
          name="inspectionStart"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:col-span-3">
              <FormLabel htmlFor="inspectionStart">Fecha y Hora</FormLabel>
              <FormControl>
                <DateTimePicker
                  granularity={"minute"}
                  value={fromDate(field.value, "CST")}
                  onChange={date => {
                    field.onChange(date.toDate("CST"))
                  }}
                  //defaultValue={fromDate(new Date(), "CST")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Event Type */}
        <FormField
          control={form.control}
          name="inspectionTripType"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:col-span-3">
              <FormLabel htmlFor="eventType">Tipo de Inspección</FormLabel>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-2 gap-4"
              >
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-violet-500 [&:has([data-state=checked])>div]:ring-violet-200">
                    <FormControl>
                      <RadioGroupItem
                        value={InspectionTripType.IN}
                        className="sr-only"
                      />
                    </FormControl>
                    <div className="flex h-10 flex-row items-center gap-2 rounded-md border px-4 ring-2 ring-white">
                      <ArrowLeftFromLine className="h-4 w-4" />
                      Entrada
                    </div>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-violet-500 [&:has([data-state=checked])>div]:ring-violet-200">
                    <FormControl>
                      <RadioGroupItem
                        value={InspectionTripType.OUT}
                        className="sr-only"
                      />
                    </FormControl>
                    <div className="flex h-10 flex-row items-center gap-2 rounded-md border px-4 ring-2 ring-white">
                      <ArrowRightFromLine className="h-4 w-4" />
                      Salida
                    </div>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
              <FormDescription>
                Especifica si la inspección es de entrada o salida
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="sm:col-span-full" />
        {/* Company */}
        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:col-span-4">
              <FormLabel htmlFor="company">Compañía de Transporte</FormLabel>
              <ComboBox
                trigger={
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between sm:w-[300px]",
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
                }
              >
                <ComboBoxInput
                  value={searchCompany}
                  onValueChange={setSearchCompany}
                  placeholder="Buscar Compañía..."
                />
                <ComboBoxList className="max-h-full sm:max-h-[300px]">
                  <ComboBoxEmpty className="p-2">
                    <Button
                      disabled={isInserting}
                      variant="ghost"
                      className="w-full"
                      size="xs"
                      onClick={handleAddCompany}
                    >
                      {isInserting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <PlusIcon className="mr-2 h-4 w-4" />
                      )}
                      {searchCompany ? `Agregar "${searchCompany}"` : "Agregar"}
                    </Button>
                  </ComboBoxEmpty>
                  <ComboBoxGroup className="overflow-y-auto sm:max-h-[300px]">
                    {companies.map(company => (
                      <ComboBoxItem
                        value={company.name}
                        key={company.id}
                        onSelect={() => {
                          form.setValue("companyId", company.id!)
                        }}
                        className="py-2 text-base sm:py-1.5 sm:text-sm"
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
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Operator */}
        <FormField
          control={form.control}
          name="operatorId"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:col-span-3">
              <FormLabel htmlFor="operator">Operador</FormLabel>
              <ComboBox
                trigger={
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between sm:w-[300px]",
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
                }
              >
                <ComboBoxInput placeholder="Buscar operador..." />
                <ComboBoxList className="max-h-full sm:max-h-[300px]">
                  <ComboBoxEmpty>No se encontró operador</ComboBoxEmpty>
                  <ComboBoxGroup className="overflow-y-auto sm:max-h-[300px]">
                    {operators.map(operator => (
                      <ComboBoxItem
                        value={operator.name}
                        key={operator.id}
                        onSelect={() => {
                          form.setValue("operatorId", operator.id!)
                          form.setValue(
                            "licenseNumber",
                            operator.licenseNumber!
                          )
                        }}
                        className="py-2 text-base sm:py-1.5 sm:text-sm"
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
                      </ComboBoxItem>
                    ))}
                  </ComboBoxGroup>
                  <ComboBoxFooter>
                    <AddOperatorForm organizationId={organizationId} />
                  </ComboBoxFooter>
                </ComboBoxList>
              </ComboBox>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="licenseNumber"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:col-span-3">
              <FormLabel htmlFor="licenseNumber">Número de Licencia</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Número de Licencia"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Vehicle */}
        <Separator className="sm:col-span-full" />
        <FormField
          control={form.control}
          name="vehicleId"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:col-span-3">
              <FormLabel htmlFor="vehicle">Tractor</FormLabel>
              <ComboBox
                trigger={
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between sm:w-[300px]",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? vehicles.find(vehicle => vehicle.id === field.value)
                            ?.vehicleNbr
                        : "Seleccionar Tractor"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                }
              >
                <ComboBoxInput placeholder="Buscar tractor..." />
                <ComboBoxList className="max-h-full sm:max-h-[300px]">
                  <ComboBoxEmpty>No se encontró tractor</ComboBoxEmpty>
                  <ComboBoxGroup className="overflow-y-auto sm:max-h-[200px]">
                    {vehicles.map(vehicle => (
                      <ComboBoxItem
                        value={vehicle.vehicleNbr}
                        key={vehicle.id}
                        onSelect={() => {
                          form.setValue("vehicleId", vehicle.id!)
                          form.setValue("licensePlate", vehicle.licensePlate!)
                        }}
                        className="py-2 text-base sm:py-1.5 sm:text-sm"
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
                      </ComboBoxItem>
                    ))}
                  </ComboBoxGroup>
                  <ComboBoxFooter>
                    <AddVehicleForm organizationId={organizationId} />
                  </ComboBoxFooter>
                </ComboBoxList>
              </ComboBox>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="licensePlate"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:col-span-3">
              <FormLabel htmlFor="licensePlate">Placas</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Placas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Container */}
        <FormField
          control={form.control}
          name="containerId"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:col-span-3">
              <FormLabel htmlFor="container">Remolque</FormLabel>
              <ComboBox
                trigger={
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between sm:w-[300px]",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? containers.find(
                            container => container.id === field.value
                          )?.containerNbr
                        : "Seleccionar Remolque"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                }
              >
                <ComboBoxInput
                  value={searchContainer}
                  onValueChange={setsearchContainer}
                  placeholder="Buscar Remolque..."
                />
                <ComboBoxList className="max-h-full sm:max-h-[300px]">
                  <ComboBoxEmpty className="p-2">
                    <Button
                      disabled={isInsertingContainer}
                      variant="ghost"
                      className="w-full"
                      size="xs"
                      onClick={handleAddContainer}
                    >
                      {isInsertingContainer ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <PlusIcon className="mr-2 h-4 w-4" />
                      )}
                      {searchContainer
                        ? `Agregar "${searchContainer}"`
                        : "Agregar"}
                    </Button>
                  </ComboBoxEmpty>
                  <ComboBoxGroup className="overflow-y-auto sm:max-h-[200px]">
                    {containers.map(container => (
                      <ComboBoxItem
                        value={container.containerNbr}
                        key={container.id}
                        onSelect={() => {
                          form.setValue("containerId", container.id!)
                        }}
                        className="py-2 text-base sm:py-1.5 sm:text-sm"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            container.id === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {container.containerNbr}
                      </ComboBoxItem>
                    ))}
                  </ComboBoxGroup>
                </ComboBoxList>
              </ComboBox>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Is loaded */}
        <FormField
          control={form.control}
          name="isLoaded"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded border p-4 sm:col-span-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor="isLoaded">Remolque cargado</FormLabel>
                <FormDescription>
                  Especifica si el ingreso del remolque es cargado o vacío
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full sm:col-span-6"
          disabled={isInsertingInspection}
        >
          {isInsertingInspection ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {"Cargando..."}
            </>
          ) : (
            "Iniciar Inspección"
          )}
        </Button>
      </form>
      {/* <DevTool control={form.control} /> */}
    </Form>
  )
}
