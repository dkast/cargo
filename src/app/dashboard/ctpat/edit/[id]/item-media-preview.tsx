import { type InspectionItemFile } from "@prisma/client"

import ImageViewer from "@/components/ui/image-viewer"

export default function ItemMediaPreview({
  fileList
}: {
  fileList: Partial<InspectionItemFile>[]
}) {
  return (
    <ul className="flex flex-row gap-x-2">
      {fileList.map(file => (
        <li key={file.id}>
          {file.fileUrl && <ImageViewer src={file.fileUrl} />}
        </li>
      ))}
    </ul>
  )
}
