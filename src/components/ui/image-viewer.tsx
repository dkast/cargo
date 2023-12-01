import Zoom from "react-medium-image-zoom"

import { cn } from "@/lib/utils"

import "react-medium-image-zoom/dist/styles.css"

export default function ImageViewer({
  src,
  className
}: {
  src: string
  className?: string
}) {
  return (
    <Zoom>
      <picture>
        <source media="(max-width: 100%)" srcSet={src} />
        <img
          src={src}
          alt=""
          className={cn("h-16 w-20 rounded-lg object-cover", className)}
        />
      </picture>
    </Zoom>
  )
}
