"use client"

import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { MembershipRole, type Organization } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { type z } from "zod"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger
} from "@/components/ui/dialog"
import { BrandImageUploader } from "@/components/ui/file-upload/brand-image-uploader"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { updateOrg } from "@/server/actions/organization"
import { orgSchema } from "@/lib/types"
import { getInitials } from "@/lib/utils"

export default function OrganizationForm({
  data,
  enabled
}: {
  data: Organization
  enabled: boolean
}) {
  const form = useForm<z.infer<typeof orgSchema>>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      id: data.id,
      name: data.name,
      image: data.image ?? undefined,
      description: data.description ?? undefined,
      subdomain: data.subdomain
    }
  })

  const router = useRouter()
  const user = useSession().data?.user

  // Get state from form
  const { isDirty } = form.formState

  const { execute, status, reset } = useAction(updateOrg, {
    onSuccess: data => {
      if (data?.success) {
        toast.success("Datos actualizados")
      } else if (data?.failure.reason) {
        toast.error(data.failure.reason)
      }

      // Reset response object
      reset()
    },
    onError: () => {
      toast.error("Algo salio mal")

      // Reset response object
      reset()
    }
  })

  const onSubmit = async (data: z.infer<typeof orgSchema>) => {
    if (!isDirty) return

    await execute(data)
    form.reset(data)
  }

  if (!user) return null

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={!enabled} className="mt-10 space-y-6">
          <div className="flex items-center gap-x-8">
            <Avatar className="h-24 w-24 rounded-xl">
              {data.image && (
                <AvatarImage src={data.image} className="rounded-xl border" />
              )}
              <AvatarFallback className="text-3xl">
                {getInitials(data.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <Dialog>
                <DialogTrigger>
                  <Button type="button" variant="outline">
                    Cambiar imagen
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>Subir imagen</DialogHeader>
                  <BrandImageUploader
                    organizationId={data.id}
                    onUploadSuccess={() => {
                      router.refresh()
                    }}
                  ></BrandImageUploader>
                </DialogContent>
              </Dialog>
              <p className="mt-2 text-xs leading-5 text-gray-500">
                Se recomienda un tamaño de 400x400 en formato JPG o PNG.
              </p>
            </div>
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">Nombre de la organización</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Nombre de la organización"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="description">Descripción</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Descripción" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subdomain"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="subdomain">Subdominio</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    disabled={user.role !== MembershipRole.ADMIN}
                    placeholder="Subdominio"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-start pt-6">
            <Button disabled={status === "executing"} type="submit">
              {status === "executing" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  {"Guardando..."}
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  )
}
