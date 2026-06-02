import { z } from "zod"

export const modificarUsuarioSchema = z.object({
  nombreCompleto: z
    .string()
    .max(200, "Maximo 200 caracteres")
    .nullable(),
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Formato de email invalido")
    .max(256, "Maximo 256 caracteres"),
  userName: z
    .string()
    .min(3, "Minimo 3 caracteres")
    .max(50, "Maximo 50 caracteres")
    .regex(
      /^[a-zA-Z0-9._\-]+$/,
      "Solo letras, numeros, puntos, guiones y guiones bajos"
    ),
})

export type ModificarUsuarioFormValues = z.infer<typeof modificarUsuarioSchema>
