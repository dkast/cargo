"use client"

import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useAction } from "next-safe-action/hooks"
import { notFound, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { approveCTPATInspection } from "@/server/actions/ctpat"

export function InspectionApprove({
  inspectionId,
  organizationId
}: {
  inspectionId: string
  organizationId: string
}) {
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

  return (
    <Button
      type="button"
      variant="default"
      disabled={status === "executing"}
      onClick={() =>
        execute({
          id: inspectionId,
          organizationId,
          approvedById: session?.user?.membershipId
        })
      }
    >
      {status === "executing" ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {"Guardando..."}
        </>
      ) : (
        "Aprobar Inspección"
      )}
    </Button>
  )
}
