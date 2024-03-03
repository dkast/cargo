"use client"

import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useAction } from "next-safe-action/hooks"
import { notFound, useRouter } from "next/navigation"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { approveCTPATInspection } from "@/server/actions/ctpat"

const commentSchema = z.object({
  comments: z
    .string({
      required_error: "Comentarios son requeridos"
    })
    .min(1, "Comentarios son requeridos")
})

export function InspectionApprove({
  inspectionId,
  organizationId
}: {
  inspectionId: string
  organizationId: string
}) {
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema)
  })
  const { data: session } = useSession()
  const router = useRouter()
  const { execute, status } = useAction(approveCTPATInspection, {
    onSuccess: () => {
      toast.success("Inspección aprobada")
      router.back()
    },
    onError: () => {
      toast.error("Error al aprobar inspección")
    }
  })

  if (!session) {
    return notFound()
  }

  const onSubmit = (data: z.infer<typeof commentSchema>) => {
    execute({
      id: inspectionId,
      organizationId,
      approvedById: session?.user?.membershipId,
      comments: data.comments
    })
  }

  return (
    <>
      <Separator className="my-3" />
      <Form {...form}>
        <form
          className="flex flex-col space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Comentarios de aprobación"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="default"
            disabled={status === "executing"}
            className="self-end"
          >
            {status === "executing" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                {"Guardando..."}
              </>
            ) : (
              "Aprobar Inspección"
            )}
          </Button>
        </form>
      </Form>
    </>
  )
}
