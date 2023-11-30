import LoginForm from "@/app/(auth)/login/login-form"
import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Iniciar sesión en Cargo"
}

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center gap-x-3">
              <img className="h-10 w-auto" src="/logo.svg" alt="Cargo" />
              <span className="font-display text-4xl font-medium tracking-tight">
                cargo
              </span>
            </div>
            <h2 className="mt-8 text-2xl font-medium leading-9 tracking-tight text-gray-900">
              Bienvenido
            </h2>
          </div>

          <div className="mt-10">
            <div>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover grayscale"
          src="https://images.unsplash.com/photo-1616432043562-3671ea2e5242?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1908&q=80"
          alt=""
        />
      </div>
    </div>
  )
}
