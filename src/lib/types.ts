import { addMinutes } from "date-fns"
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

export const operatorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres"
  }),
  licenseNumber: z.string().min(3, {
    message: "El número de licencia debe tener al menos 3 caracteres"
  }),
  organizationId: z.string().cuid()
})

export const vehicleSchema = z.object({
  id: z.string().optional(),
  vehicleNbr: z.string().min(2, {
    message: "El identificador debe tener al menos 2 caracteres"
  }),
  licensePlate: z.string().min(3, {
    message: "La placa debe tener al menos 3 caracteres"
  }),
  organizationId: z.string().cuid()
})

export const containerSchema = z.object({
  id: z.string().optional(),
  containerNbr: z.string().min(2, {
    message: "El identificador debe tener al menos 2 caracteres"
  }),
  organizationId: z.string().cuid()
})

export const ctpatMainSchema = z.object({
  companyId: z.string({
    required_error: "Este campo es requerido"
  }),
  operatorId: z.string({
    required_error: "Este campo es requerido"
  }),
  licenseNumber: z.string({
    required_error: "Este campo es requerido"
  }),
  vehicleId: z.string({
    required_error: "Este campo es requerido"
  }),
  licensePlate: z.string({
    required_error: "Este campo es requerido"
  }),
  containerId: z.string({
    required_error: "Este campo es requerido"
  }),
  isLoaded: z.boolean({
    required_error: "Este campo es requerido"
  }),
  start: z
    .date({
      required_error: "Este campo es requerido"
    })
    .max(addMinutes(new Date(), 5), {
      message: "La fecha y hora no puede ser mayor a la actual"
    }),
  tripType: z.enum(["IN", "OUT"], {
    required_error: "Este campo es requerido"
  }),
  organizationId: z.string(),
  inspectedById: z.string()
})

export enum actionType {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE"
}
