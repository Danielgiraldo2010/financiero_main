// src\features\identidad\usuarios\crear\schema.ts
import { z } from "zod"

// Orden de jerarquía descendente — un rol solo puede asignar roles de nivel igual o inferior
const ROLES = [
  "SUPERADMIN",
  "ADMIN_CENTRAL",
  "FINANCIERO_CENTRAL",
  "DECANO",
  "COORDINADOR",
  "FINANCIERO",
  "CONSULTOR",
] as const

export type RolSistema = (typeof ROLES)[number]

/**
 * Retorna los roles que un usuario puede asignar al crear otro usuario,
 * basándose en su propio conjunto de roles.
 *
 * Reglas:
 *  - SUPERADMIN         → puede asignar cualquier rol
 *  - ADMIN_CENTRAL      → puede asignar todo excepto SUPERADMIN
 *  - FINANCIERO_CENTRAL → puede asignar DECANO, COORDINADOR, FINANCIERO, CONSULTOR
 *  - Cualquier otro     → no debería llegar a este formulario (RoleGuard lo bloquea)
 */
export function getRolesAsignables(rolesDelCreador: string[]): RolSistema[] {
  if (rolesDelCreador.includes("SUPERADMIN")) {
    return [...ROLES]
  }
  if (rolesDelCreador.includes("ADMIN_CENTRAL")) {
    return ROLES.filter((r) => r !== "SUPERADMIN")
  }
  if (rolesDelCreador.includes("FINANCIERO_CENTRAL")) {
    return ["DECANO", "COORDINADOR", "FINANCIERO", "CONSULTOR"]
  }
  // Fallback seguro: solo puede crear CONSULTOR
  return ["CONSULTOR"]
}

export const crearUsuarioSchema = z.object({
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Formato de email inválido"),

  userName: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(50, "Máximo 50 caracteres"),

  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número")
    // Alineado con CrearUsuarioValidator.cs: Matches(@"[\W_]")
    .regex(/[\W_]/, "Debe contener al menos un carácter especial (ej: @, #, !)"),

  nombreCompleto: z
    .string()
    .min(2, "El nombre completo es obligatorio")
    .max(200, "Máximo 200 caracteres"),

  unidadEjecutoraId: z
    .number({ required_error: "Seleccione una unidad ejecutora" })
    .int()
    .positive("La unidad ejecutora es obligatoria"),

  rol: z.enum(ROLES, {
    required_error: "Seleccione un rol",
    message: "Rol inválido",
  }),
})

export type CrearUsuarioFormValues = z.infer<typeof crearUsuarioSchema>
export { ROLES }