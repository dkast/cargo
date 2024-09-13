"use client"

import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
// import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { OrganizationPlan, OrganizationStatus } from "@prisma/client"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { type z } from "zod"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { createOrg, updateOrg } from "@/server/actions/organization"
import { actionType, orgSchema } from "@/lib/types"
import { getInitials } from "@/lib/utils"

export default function OrganizationAdminForm({
  data,
  action,
  enabled
}: {
  data: z.infer<typeof orgSchema> | null
  action: actionType
  enabled: boolean
}) {
  const form = useForm<z.infer<typeof orgSchema>>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      id: data?.id,
      name: data?.name,
      image: data?.image ?? undefined,
      description: data?.description ?? "",
      subdomain: data?.subdomain,
      status: data?.status,
      plan: data?.plan
    },
    mode: "onChange"
  })
  const queryClient = useQueryClient()
  const router = useRouter()

  // const { isDirty } = form.formState

  const {
    execute: executeUpdate,
    isExecuting: isUpdating,
    reset: resetUpdate
  } = useAction(updateOrg, {
    onSuccess: ({ data, input }) => {
      if (data?.success) {
        toast.success("Datos actualizados")
        queryClient.invalidateQueries({
          queryKey: ["organization", input.subdomain]
        })
      } else if (data?.failure?.reason) {
        toast.error(data.failure?.reason)
      }
      resetUpdate()
      router.push("/admin")
    },
    onError: () => {
      toast.error("Algo salio mal en la actualización")
      resetUpdate()
    }
  })

  const {
    execute: executeCreate,
    isExecuting: isCreating,
    reset: resetCreate
  } = useAction(createOrg, {
    onSuccess: ({ data, input }) => {
      if (data?.success) {
        toast.success("Organización creada")
        queryClient.invalidateQueries({
          queryKey: ["organization", input.subdomain]
        })
      } else if (data?.failure?.reason) {
        toast.error(data.failure?.reason)
      }
      resetCreate()
      router.push("/admin")
    },
    onError: () => {
      toast.error("Algo salió mal al crear la organización")
      resetCreate()
    }
  })

  const onSubmit = async (data: z.infer<typeof orgSchema>) => {
    // if (!isDirty) return

    if (action === actionType.CREATE) {
      await executeCreate(data)
    } else {
      await executeUpdate(data)
    }
    form.reset(data)
  }

  if (!data) return null

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={!enabled} className="mt-10 space-y-6">
          <div className="flex items-center gap-x-8">
            <Avatar className="h-24 w-24 rounded-xl">
              {data.image && (
                <AvatarImage
                  src={data.image}
                  className="rounded-xl border dark:border-transparent"
                />
              )}
              <AvatarFallback className="text-3xl">
                {getInitials(data.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <Dialog>
                <DialogTrigger disabled={action === actionType.CREATE}>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={action === actionType.CREATE}
                  >
                    Cambiar imagen
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Subir imagen</DialogTitle>
                  </DialogHeader>
                  <BrandImageUploader
                    organizationId={data.id ?? ""}
                    onUploadSuccess={() => {
                      queryClient.invalidateQueries({
                        queryKey: ["organization", data.subdomain]
                      })
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
                  <Input type="text" placeholder="Subdominio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="status">Estatus</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estatus" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={OrganizationStatus.ACTIVE}>
                        Activo
                      </SelectItem>
                      <SelectItem value={OrganizationStatus.INACTIVE}>
                        Inactivo
                      </SelectItem>
                      <SelectItem value={OrganizationStatus.DUE}>
                        Suspendido
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="plan">Tipo de plan</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo de plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={OrganizationPlan.TRIAL}>
                        Prueba
                      </SelectItem>
                      <SelectItem value={OrganizationPlan.BASIC}>
                        Básico
                      </SelectItem>
                      <SelectItem value={OrganizationPlan.PRO}>Pro</SelectItem>
                      <SelectItem value={OrganizationPlan.ENTERPRISE}>
                        Enterprise
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-start pt-6">
            <Button disabled={isCreating || isUpdating} type="submit">
              {isCreating || isUpdating ? (
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
      {/* <DevTool control={form.control} /> */}
    </Form>
  )
}
