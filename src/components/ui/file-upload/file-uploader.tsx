"use client"

import React, { useEffect } from "react"
import AwsS3, { type AwsS3UploadParameters } from "@uppy/aws-s3"
import Uppy, { type UploadResult, type UppyFile } from "@uppy/core"
// @ts-expect-error - Uppy doesn't have types for this locale
import Spanish from "@uppy/locales/lib/es_MX"
import { Dashboard } from "@uppy/react"

// Uppy styles
import "@uppy/core/dist/style.min.css"
import "@uppy/dashboard/dist/style.min.css"
import "@uppy/webcam/dist/style.min.css"

import Webcam from "@uppy/webcam"

export async function getUploadParameters(
  file: UppyFile,
  organizationId: string,
  itemId: string
) {
  const response = await fetch("/api/file", {
    method: "POST",
    headers: {
      accept: "application/json"
    },
    body: JSON.stringify({
      organizationId,
      itemId,
      filename: file.name,
      fileHash: itemId,
      contentType: file.type
    })
  })
  if (!response.ok) throw new Error("Unsuccessful request")

  // Parse the JSON response.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: { url: string; method: "PUT" } = await response.json()

  // Return an object in the correct shape.
  const object: AwsS3UploadParameters = {
    method: data.method,
    url: data.url,
    fields: {}, // For presigned PUT uploads, this should be left empty.
    // Provide content type header required by S3
    headers: {
      "Content-Type": file.type ? file.type : "application/octet-stream"
    }
  }
  return object
}

const uppy = new Uppy({
  autoProceed: true,
  restrictions: {
    maxNumberOfFiles: 3
  },
  locale: Spanish
})
  .use(AwsS3)
  .use(Webcam)

export function FileUploader({
  organizationId,
  itemId,
  onUploadSuccess
}: {
  organizationId: string
  itemId: string
  onUploadSuccess: (result: UploadResult) => void
}) {
  useEffect(() => {
    const awsS3Plugin = uppy.getPlugin("AwsS3")
    if (awsS3Plugin) {
      awsS3Plugin.setOptions({
        getUploadParameters: (file: UppyFile) =>
          getUploadParameters(file, organizationId, itemId)
      })
    }
    uppy.on("complete", result => {
      onUploadSuccess(result)
    })
  }, [itemId, onUploadSuccess, organizationId])
  return (
    <Dashboard
      className="mx-auto max-w-[320px] sm:max-w-[520px]"
      uppy={uppy}
      proudlyDisplayPoweredByUppy={false}
    />
  )
}
