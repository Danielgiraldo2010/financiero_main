// features/identidad/auth/perfil/schema.ts
import { z } from 'zod'
import { StrongPasswordSchema } from '../../model/schema'

export const UpdatePerfilSchema = z.object({
  userName: z
    .string()
    .min(3, 'Minimo 3 caracteres')
    .max(50, 'Maximo 50 caracteres'),
})
export type UpdatePerfilValues = z.infer<typeof UpdatePerfilSchema>

export const ChangePasswordSchema = z
  .object({
    passwordActual: z.string().min(6, 'Minimo 6 caracteres'),
    passwordNuevo: StrongPasswordSchema,
    confirmarPassword: z.string(),
  })
  .refine((d) => d.passwordNuevo === d.confirmarPassword, {
    message: 'Las contrasenas no coinciden',
    path: ['confirmarPassword'],
  })
export type ChangePasswordValues = z.infer<typeof ChangePasswordSchema>
