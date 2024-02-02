"use client"

import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import type { Metadata } from "next"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { z } from "zod"

import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { PasswordInput } from "@/components/ui/password-input"
import { verifyShareItemPassword } from "@/server/actions/share"

const VerifySchema = z.object({
  nanoid: z.string(),
  password: z.string().min(0, "La contraseña es requerida")
})

export default function SecurePage({
  params: { id }
}: {
  params: { id: string }
}) {
  const form = useForm<z.infer<typeof VerifySchema>>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      nanoid: id,
      password: ""
    }
  })

  const router = useRouter()

  const { execute, status, reset } = useAction(verifyShareItemPassword, {
    onSuccess: data => {
      if (data.failure?.reason) {
        toast.error(data.failure.reason)
      } else if (data.success) {
        router.push(data.success.shareItem.sharePath)
      }
      reset()
    },
    onError: () => {
      toast.error("Algo salió mal, por favor intente de nuevo más tarde")
      reset()
    }
  })

  const onSubmit = async (data: z.infer<typeof VerifySchema>) => {
    console.log(data)
    await execute(data)
  }

  return (
    <div className="flex h-svh items-center justify-center">
      <div className="max-w-md px-4">
        <div className="my-8 flex items-center justify-center gap-2">
          <Logo className="size-10 fill-gray-900" />
          <h1 className="font-display text-2xl font-medium tracking-tight text-gray-900 sm:text-4xl">
            cargo
          </h1>
        </div>
        <Card className="mx-auto min-w-80">
          <CardHeader>
            <CardTitle className="text-xl">Introduzca su contraseña</CardTitle>
            <CardDescription>
              Por favor, introduzca su contraseña para acceder a este recurso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="flex flex-col gap-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <PasswordInput
                        {...field}
                        placeholder="Introduzca su contraseña"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={status === "executing"}>
                  {status === "executing" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Acceder"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
