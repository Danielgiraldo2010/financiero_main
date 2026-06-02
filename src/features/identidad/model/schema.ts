// features/identidad/model/schema.ts
// Schemas Zod base compartidos del dominio identidad
import { z } from 'zod'

export const EmailSchema = z
  .string()
  .min(1, 'El email es obligatorio')
  .email('Email invalido')

export const PasswordSchema = z
  .string()
  .min(6, 'Minimo 6 caracteres')

export const StrongPasswordSchema = z
  .string()
  .min(8, 'Minimo 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una mayuscula')
  .regex(/[0-9]/, 'Debe contener al menos un numero')

export const TotpCodeSchema = z
  .string()
  .length(6, 'El codigo debe tener exactamente 6 digitos')
  .regex(/^[0-9]+$/, 'Solo se permiten digitos')

  // Acepta email válido O userName (sin restricción de formato)
export const LoginIdentifierSchema = z
  .string()
  .min(1, 'El usuario o email es obligatorio')