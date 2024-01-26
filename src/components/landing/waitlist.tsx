"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { z } from "zod"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { joinWaitlist } from "@/server/actions/general"

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
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { execute, status, reset } = useAction(joinWaitlist, {
    onSuccess: data => {
      if (data?.success) {
        setIsSubmitted(true)
      } else if (data?.failure.reason) {
        toast(data.failure.reason)
      }
      reset()
    }
  })

  const onSubmit = async (data: z.infer<typeof emailSchema>) => {
    await execute(data)
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center space-y-4"
      >
        <span className="text-gray-400">Unirse a la lista de espera</span>
        {!isSubmitted ? (
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
              disabled={status === "executing"}
              type="submit"
              className="bg-gradient-to-t from-orange-700 to-orange-500 hover:from-orange-500 hover:to-orange-400"
            >
              {status === "executing" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  {"Procesando..."}
                </>
              ) : (
                "Unirse"
              )}
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert className="max-w-xl space-y-2 border-gray-800 bg-gray-900">
              <AlertTitle className="text-white">
                ¡Gracias por tu interés!
              </AlertTitle>
              <AlertDescription className="text-gray-400">
                Te enviaremos un correo electrónico cuando estemos listos para
                que puedas probar la aplicación.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </form>
    </Form>
  )
}
