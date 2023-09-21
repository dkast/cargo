import { z } from "zod"

export const orgSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres"
  }),
  description: z.string().optional(),
  subdomain: z.string().min(3, {
    message: "El subdominio debe tener al menos 3 caracteres"
  })
})

export const userMemberSchema = z
  .object({
    id: z.string().optional(),
    organizationId: z.string().cuid(),
    name: z
      .string({
        required_error: "Requerido"
      })
      .min(3, {
        message: "El nombre debe tener al menos 3 caracteres"
      }),
    email: z.string().email({ message: "El email debe ser válido" }).optional(),
    username: z
      .string({
        required_error: "Requerido"
      })
      .min(3, {
        message: "El nombre de usuario debe tener al menos 3 caracteres"
      })
      .max(20, {
        message: "El nombre de usuario debe tener como máximo 20 caracteres"
      })
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9_-]+$/i, {
        message:
          "El nombre de usuario solo puede contener letras, números, guiones y guiones bajos"
      }),
    password: z
      .string({
        required_error: "Requerido"
      })
      .min(8, {
        message: "La contraseña debe tener al menos 8 caracteres"
      }),
    confirmPassword: z.string({
      required_error: "Requerido"
    }),
    role: z.enum(["ADMIN", "OWNER", "MEMBER"])
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
  })

export const companySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres"
  }),
  organizationId: z.string().cuid()
})

export enum actionType {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE"
}
