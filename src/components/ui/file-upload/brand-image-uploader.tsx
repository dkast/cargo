"use client"

import React, { useEffect, useState } from "react"
import AwsS3, { type AwsS3UploadParameters } from "@uppy/aws-s3"
import Compressor from "@uppy/compressor"
import Uppy, {
  type Body,
  type Meta,
  type UploadResult,
  type UppyFile
} from "@uppy/core"
import Spanish from "@uppy/locales/lib/es_MX"
import { Dashboard } from "@uppy/react"

// Uppy styles
import "@uppy/core/dist/style.min.css"
import "@uppy/dashboard/dist/style.min.css"
import "@uppy/webcam/dist/style.min.css"

import { useTheme } from "next-themes"

export async function getUploadParameters(
  file: UppyFile<Meta, Body>,
  organizationId: string
) {
  const response = await fetch("/api/file/brand-image", {
    method: "POST",
    headers: {
      accept: "application/json"
    },
    body: JSON.stringify({
      organizationId,
      filename: file.name,
      fileHash: "brand-image",
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

export function BrandImageUploader({
  organizationId,
  onUploadSuccess
}: {
  organizationId: string
  onUploadSuccess?: (result: UploadResult<Meta, Body>) => void
}) {
  const { theme } = useTheme()

  const [uppy] = useState(() =>
    new Uppy({
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ["image/*"],
        maxFileSize: 3 * 1024 * 1024 // 3MB
      },
      locale: Spanish
    })
      .use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: (file: UppyFile<Meta, Body>) =>
          getUploadParameters(file, organizationId)
      })
      .use(Compressor, {
        locale: Spanish
      })
  )

  useEffect(() => {
    // const awsS3Plugin = uppy.getPlugin("AwsS3")
    // if (awsS3Plugin) {
    //   awsS3Plugin.setOptions({
    //     getUploadParameters: (file: UppyFile<Meta, AwsBody>) =>
    //       getUploadParameters(file, organizationId)
    //   })
    // }

    uppy.on("complete", result => {
      if (onUploadSuccess) {
        onUploadSuccess(result)
      }
    })
  }, [uppy, onUploadSuccess, organizationId])

  return (
    <Dashboard
      className="mx-auto max-w-[320px] sm:max-w-[520px]"
      uppy={uppy}
      waitForThumbnailsBeforeUpload
      proudlyDisplayPoweredByUppy={false}
      theme={theme === "dark" ? "dark" : theme === "system" ? "auto" : "light"}
    />
  )
}
