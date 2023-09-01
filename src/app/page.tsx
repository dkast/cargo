import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
      <h1 className="text-3xl">Cargo</h1>
      <Button asChild>
        <Link href="/dashboard">Entrar</Link>
      </Button>
    </div>
  )
}
