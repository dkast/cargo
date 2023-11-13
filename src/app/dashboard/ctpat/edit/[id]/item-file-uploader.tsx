"use client"

import { type UploadResult } from "@uppy/core"
import { useRouter } from "next/navigation"

import { FileUploader } from "@/components/ui/file-upload/file-uploader"

export function ItemFileUploader({
  organizationId,
  itemId
}: {
  organizationId: string
  itemId: string
}) {
  const router = useRouter()
  const onUploadSuccess = async (result: UploadResult) => {
    // If the upload was successful, revalidate the cache for the media
    if (result.successful) {
      router.refresh()
    }
  }

  return (
    <FileUploader
      organizationId={organizationId}
      itemId={itemId}
      onUploadSuccess={onUploadSuccess}
    />
  )
}
