"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function GreetingMessage() {
  const humanDate = format(new Date(), "EEEE, d MMMM yyyy", { locale: es })
  return <>{humanDate}</>
}
