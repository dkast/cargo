"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const emailSchema = z.object({
  email: z.string().email({
    message: "El correo electrónico no es válido"
  })
})

export default function Waitlist() {
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center space-y-4"
      >
        <span className="text-gray-400">Unirse a la lista de espera</span>
        <div className="flex flex-row items-start justify-center gap-x-2">
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
                  />
                </FormControl>
                <FormMessage />
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
  )
}
