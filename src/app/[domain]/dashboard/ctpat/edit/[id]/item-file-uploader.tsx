"use client"

import { type Body, type Meta, type UploadResult } from "@uppy/core"

import { FileUploader } from "@/components/ui/file-upload/file-uploader"

export function ItemFileUploader({
  organizationId,
  itemId,
  onUploadSuccess
}: {
  organizationId: string
  itemId: string
  onUploadSuccess: (result: UploadResult<Meta, Body>) => void
}) {
  return (
    <FileUploader
      organizationId={organizationId}
      itemId={itemId}
      onUploadSuccess={onUploadSuccess}
    />
  )
}
