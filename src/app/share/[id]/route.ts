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
    // If the share item has expired, redirect to the expired page
    if (shareItem.expiresAt && shareItem.expiresAt < new Date()) {
      redirect("/share/expired")
    }

    // If the share item is password protected, redirect to the password page
    if (shareItem.password) {
      redirect(`/share/${shareId}/secure`)
    } else {
      redirect(shareItem.sharePath)
    }
  }
}
