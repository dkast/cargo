"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { fromDate } from "@internationalized/date"
import { AccessType } from "@prisma/client"
import { Globe, Loader2, LockKeyhole } from "lucide-react"
import { useSession } from "next-auth/react"
import { useAction } from "next-safe-action/hooks"
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
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { PasswordInput } from "@/components/ui/password-input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createShareItem } from "@/server/actions/share"
import { ShareFormSchema } from "@/lib/types"
import { useMobile } from "@/lib/use-mobile"
import { cn } from "@/lib/utils"

export default function Share({
  children,
  path
}: {
  children: React.ReactNode
  path?: string
}) {
  const isMobile = useMobile()

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Compartir</DrawerTitle>
            <DrawerDescription>
              Compartir vínculo para dar acceso a esta inspección.
            </DrawerDescription>
          </DrawerHeader>
          <ShareForm path={path} className="px-4 pb-4" />
        </DrawerContent>
      </Drawer>
    )
  }

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
        <ShareForm path={path} />
      </DialogContent>
    </Dialog>
  )
}

function ShareForm({ path, className }: { path?: string; className?: string }) {
  const user = useSession().data?.user
  const pathname = usePathname()
  const form = useForm<z.infer<typeof ShareFormSchema>>({
    resolver: zodResolver(ShareFormSchema),
    defaultValues: {
      accessType: AccessType.PUBLIC,
      sharePath: path ?? pathname,
      password: "",
      expiresAt: undefined,
      organizationId: user?.organizationId
    }
  })

  const accessType = form.watch("accessType")

  // const [copiedText, copy] = useCopyToClipboard()
  const [shareURL, setShareURL] = useState<string | undefined>(undefined)
  const {
    execute: createShare,
    status: shareStatus,
    reset: resetShare
  } = useAction(createShareItem, {
    onSuccess: async data => {
      if (data?.failure?.reason) {
        toast.error(data.failure.reason)
      } else if (data?.success) {
        const text = new ClipboardItem({
          "text/plain": new Blob([data.success.shareURL], {
            type: "text/plain"
          })
        })

        if (navigator?.share) {
          await navigator
            .share({
              title: "Compartir inspección",
              url: data.success.shareURL
            })
            .then(() => {
              setShareURL(data.success.shareURL)
            })
            .catch(error => {
              toast.error("Algo salió mal al compartir el vínculo")
              console.error(error)
            })
        } else {
          await navigator.clipboard
            .write([text])
            .then(() => {
              setShareURL(data.success.shareURL)
              toast.success("Vínculo copiado al portapapeles")
            })
            .catch(error => {
              toast.error("Algo salió mal al copiar el vínculo al portapapeles")
              console.error(error)
            })
        }
      }
      resetShare()
    },
    onError: () => {
      toast.error("Algo salió mal al compartir el vínculo")
      resetShare()
    }
  })

  const onSubmit = async (data: z.infer<typeof ShareFormSchema>) => {
    console.dir(data)
    if (shareURL && !form.formState.isDirty) {
      const text = new ClipboardItem({
        "text/plain": new Blob([shareURL], {
          type: "text/plain"
        })
      })

      if (navigator?.share) {
        await navigator
          .share({
            title: "Compartir inspección",
            url: shareURL
          })
          .then(() => {
            setShareURL(shareURL)
          })
          .catch(error => {
            toast.error("Algo salió mal al compartir el vínculo")
            console.error(error)
            toast.error(error.message)
          })
      } else {
        await navigator.clipboard
          .write([text])
          .then(() => {
            setShareURL(shareURL)
            toast.success("Vínculo copiado al portapapeles")
          })
          .catch(error => {
            toast.error("Algo salió mal al copiar el vínculo al portapapeles")
            console.error(error)
            toast.error(error.message)
          })
      }
    } else {
      await createShare(data)
      form.reset(data)
    }
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Form {...form}>
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
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
                  <PasswordInput {...field} />
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
          <Button type="submit" disabled={shareStatus === "executing"}>
            {shareStatus === "executing" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Copiar vínculo"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
