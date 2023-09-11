import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-y-32 
      bg-gray-400 bg-[url(https://images.unsplash.com/photo-1571958529064-eaf827bf97d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1908&q=80)] bg-blend-screen grayscale"
    >
      <div className="flex items-center gap-x-4">
        <img className="h-20 w-auto" src="/logo.svg" alt="Cargo" />
        <h1 className="font-display text-6xl">Cargo</h1>
      </div>
      <Button asChild size="lg">
        <Link href="/dashboard">Entrar</Link>
      </Button>
    </div>
  )
}
