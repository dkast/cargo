import { Form, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { type z } from "zod"

import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { emailSchema } from "./page"

export default function HomePage() {
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: ""
    }
  })

  const onSubmit = async (data: z.infer<typeof emailSchema>) => {
    console.log(data)
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-gray-950 bg-[url(/bg-landing.svg)] 
      bg-cover bg-center bg-no-repeat"
    >
      <div className="fixed right-4 top-4 text-white hover:underline">
        <Link href="/dashboard">Iniciar sesión</Link>
      </div>
      <div className="flex flex-col">
        <div className="mb-10 flex items-center justify-center gap-x-4 text-white">
          <Logo className="h-10 w-auto fill-white" />
          <h1 className="font-display text-5xl font-medium tracking-tight">
            cargo
          </h1>
        </div>
        <section className="flex max-w-4xl flex-col gap-y-10 text-center">
          <h1 className="font-display text-5xl font-medium tracking-tight text-orange-500">
            Simplifica tus procesos de C-TPAT
          </h1>
          <p className="text-lg text-gray-400">
            <span className="text-white">Cargo</span> es una aplicación que te
            facilita la creación, el envío y la recepción de tus formatos CTPAT
            desde cualquier dispositivo. Despídete de las dificultades
            documentales para enfócarte en tu negocio.
          </p>
        </section>
        <section className="mt-10 flex flex-col items-center gap-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <span className="text-gray-400">Unirse a la lista de espera</span>
              <div className="flex flex-row items-center justify-center gap-x-2">
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="nombre@correo.com"
                          className="max-w-[300px] border border-gray-700 bg-gray-800 text-white"
                          {...field}
                        ></Input>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-t from-orange-700 to-orange-500 hover:from-orange-500 hover:to-orange-400"
                >
                  Unirse
                </Button>
              </div>
            </form>
          </Form>
        </section>
      </div>
    </div>
  )
}
