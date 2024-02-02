import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { PasswordInput } from "@/components/ui/password-input"

export default function SecurePage() {
  return (
    <div className="flex h-svh items-center justify-center">
      <div className="max-w-md px-4">
        <div className="my-8 flex items-center justify-center gap-2">
          <Logo className="size-10 fill-gray-900" />
          <h1 className="font-display text-2xl font-medium tracking-tight text-gray-900 sm:text-4xl">
            cargo
          </h1>
        </div>
        <Card className="mx-auto min-w-80">
          <CardHeader>
            <CardTitle className="text-xl">Introduzca su contraseña</CardTitle>
            <CardDescription>
              Por favor, introduzca su contraseña para acceder a este recurso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-y-6">
              <PasswordInput />
              <Button type="button">Acceder</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
