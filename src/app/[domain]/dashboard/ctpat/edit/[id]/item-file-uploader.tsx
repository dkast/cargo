"use client"

import { type UploadResult } from "@uppy/core"

import { FileUploader } from "@/components/ui/file-upload/file-uploader"

export function ItemFileUploader({
  organizationId,
  itemId,
  onUploadSuccess
}: {
  organizationId: string
  itemId: string
  onUploadSuccess: (result: UploadResult) => void
}) {
  return (
    <FileUploader
      organizationId={organizationId}
      itemId={itemId}
      onUploadSuccess={onUploadSuccess}
    />
  )
}
