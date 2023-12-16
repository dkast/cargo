import { PhotoView } from "react-photo-view"

import { cn } from "@/lib/utils"

export default function ImageViewer({
  src,
  className
}: {
  src: string
  className?: string
}) {
  return (
    <PhotoView src={src}>
      <img
        src={src}
        alt=""
        className={cn(
          "h-16 w-20 cursor-zoom-in rounded-lg object-cover",
          className
        )}
      />
    </PhotoView>
  )
}
