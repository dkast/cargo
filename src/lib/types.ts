import { z } from "zod"

export const orgSchema = z.object({
  id: z.string(),
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres"
  }),
  description: z.string().optional(),
  subdomain: z.string().min(3, {
    message: "El subdominio debe tener al menos 3 caracteres"
  })
})
