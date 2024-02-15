import Link from "next/link"

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center gap-y-2 py-5 text-sm sm:py-10">
      <p className="text-gray-600">
        &copy; {new Date().getFullYear()} Cargo. Todos los derechos reservados.
      </p>
      <div className="flex gap-x-4">
        <Link href="/terms" className="text-gray-600 hover:text-gray-800">
          Términos de uso
        </Link>
        <Link href="/privacy" className="text-gray-600 hover:text-gray-800">
          Política de privacidad
        </Link>
      </div>
    </footer>
  )
}
