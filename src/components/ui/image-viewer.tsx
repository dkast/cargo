import Zoom from "react-medium-image-zoom"

import "react-medium-image-zoom/dist/styles.css"

export default function ImageViewer({ src }: { src: string }) {
  return (
    <Zoom>
      <picture>
        <source media="(max-width: 768px)" srcSet={src} />
        <img
          src={src}
          alt=""
          className="h-16 w-20 rounded-lg object-cover shadow"
        />
      </picture>
    </Zoom>
  )
}
