import { Copy } from "lucide-react"
import { headers } from "next/headers"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Share({ children }: { children: React.ReactNode }) {
  const headersList = headers()
  const url = `${headersList.get("host")}/${headersList.get("next-url")}`

  if (!url) return null

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>Compartir</DialogHeader>
        <DialogDescription>
          Comparte este enlace con los usuarios que deseas que tengan acceso a
          esta inspección.
        </DialogDescription>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Liga
            </Label>
            <Input id="link" defaultValue={url} readOnly />
          </div>
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copiar</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
