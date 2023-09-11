import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl">Cargo</h1>
      <Button asChild>
        <Link href="/dashboard">Entrar</Link>
      </Button>
    </div>
  )
}
