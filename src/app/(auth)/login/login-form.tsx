"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { z } from "zod"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const loginSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "El nombre de usuario debe tener al menos 3 caracteres"
    })
    .max(50),
  password: z.string().min(1, {
    message: "La contraseña no puede estar vacía"
  })
})

export default function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const callbackUrl = searchParams.get("callbackUrl")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true)
    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      callbackUrl: callbackUrl ? callbackUrl : "/dashboard"
    })

    if (!res) return null
    if (res.error) {
      toast.error("Usuario o contraseña incorrectos")
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="username">Nombre de usuario</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de usuario" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password">Contraseña</FormLabel>
              <FormControl>
                <Input placeholder="Contraseña" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
              {"Iniciando sesión..."}
            </>
          ) : (
            "Iniciar sesión"
          )}
        </Button>
        {error && (
          <div>
            <Alert variant="destructive">
              <AlertDescription>
                Usuario y/o contraseña incorrectos
              </AlertDescription>
            </Alert>
          </div>
        )}
      </form>
    </Form>
  )
}
