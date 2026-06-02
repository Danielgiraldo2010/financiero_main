// features/identidad/auth/login/schema.ts
import { z } from 'zod'
import { LoginIdentifierSchema, PasswordSchema, TotpCodeSchema } from '../../model/schema'

export const LoginSchema = z.object({
  email: LoginIdentifierSchema,   // acepta admin@sf, admin, usuario@ucaldas.edu.co
  password: PasswordSchema,
})
export type LoginFormValues = z.infer<typeof LoginSchema>

export const VerifyTotpSchema = z.object({
  codigoTotp: TotpCodeSchema,
})
export type VerifyTotpValues = z.infer<typeof VerifyTotpSchema>
