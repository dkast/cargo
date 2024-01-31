"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { fromDate } from "@internationalized/date"
import { Globe, LockKeyhole } from "lucide-react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { type z } from "zod"

import { Button } from "@/components/ui/button"
import { DateTimePicker } from "@/components/ui/date-time-picker/date-time-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AccessType, ShareFormSchema } from "@/lib/types"
import { cn, getBaseUrl } from "@/lib/utils"

export default function Share({ children }: { children: React.ReactNode }) {
  const user = useSession().data?.user
  const pathname = usePathname()
  const form = useForm<z.infer<typeof ShareFormSchema>>({
    resolver: zodResolver(ShareFormSchema),
    defaultValues: {
      sharePath: getBaseUrl() + pathname,
      accessType: AccessType.PUBLIC,
      password: "",
      expiresAt: undefined,
      organizationId: user?.organizationId
    }
  })

  const accessType = form.watch("accessType")

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartir</DialogTitle>
          <DialogDescription>
            Compartir vínculo para dar acceso a esta inspección.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Form {...form}>
            <form
              className="flex w-full flex-col gap-4"
              onSubmit={form.handleSubmit(console.log)}
            >
              <FormField
                control={form.control}
                name="sharePath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="link" className="sr-only">
                      Liga
                    </FormLabel>
                    <FormControl>
                      <Input disabled type="text" {...field} readOnly />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="accessType">Seguridad</FormLabel>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormItem>
                        <FormLabel className="cursor-pointer [&:has([data-state=checked])>div]:border-blue-500 [&:has([data-state=checked])>div]:ring-blue-200">
                          <div className="flex flex-row items-center justify-between gap-2 rounded-md border px-4 py-2 ring-2 ring-white">
                            <div className="rounded-full bg-green-100 p-1.5">
                              <Globe className="size-5 text-green-500" />
                            </div>
                            <div className="flex grow flex-col">
                              <span className="text-sm">Público</span>
                              <span className="text-xs text-gray-500">
                                Cualquiera con el enlace puede acceder
                              </span>
                            </div>
                            <FormControl>
                              <RadioGroupItem
                                value={AccessType.PUBLIC}
                                className="border-gray-300 text-blue-500 [&:has([data-state=checked])]:border-blue-500"
                              />
                            </FormControl>
                          </div>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormLabel className="cursor-pointer [&:has([data-state=checked])>div]:border-blue-500 [&:has([data-state=checked])>div]:ring-blue-200">
                          <div className="flex flex-row items-center justify-between gap-2 rounded-md border px-4 py-2 ring-2 ring-white">
                            <div className="rounded-full bg-gray-100 p-1.5">
                              <LockKeyhole className="size-5 text-gray-500" />
                            </div>
                            <div className="flex grow flex-col">
                              <span className="text-sm">Privado</span>
                              <span className="text-xs text-gray-500">
                                Solo usuarios con la contraseña pueden acceder
                              </span>
                            </div>
                            <FormControl>
                              <RadioGroupItem
                                value={AccessType.PRIVATE}
                                className="border-gray-300 text-blue-500 [&:has([data-state=checked])]:border-blue-500"
                              />
                            </FormControl>
                          </div>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      accessType === AccessType.PUBLIC ? "hidden" : "block"
                    )}
                  >
                    <FormLabel htmlFor="password">Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="expiresAt">Expira</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        granularity={"day"}
                        value={
                          field.value ? fromDate(field.value, "CST") : undefined
                        }
                        onChange={date => {
                          field.onChange(date.toDate("CST"))
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Copiar vínculo</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
