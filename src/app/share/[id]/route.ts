import { notFound, redirect } from "next/navigation"

import { prisma } from "@/server/db"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const shareId = params.id

  if (!shareId) {
    notFound()
  }

  // Find the share item in the database
  const shareItem = await prisma.shareItem.findUnique({
    where: {
      nanoid: shareId
    }
  })

  if (!shareItem) {
    notFound()
  } else {
    redirect(shareItem.sharePath)
  }
}
