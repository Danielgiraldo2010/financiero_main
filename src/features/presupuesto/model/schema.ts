// features/presupuesto/model/schema.ts
// Zod schemas — espejo de FluentValidation del backend

import { z } from 'zod';

// ── Registrar Techo Presupuestal ──────────────────────────────────────────
export const RegistrarTechoSchema = z.object({
  vigencia: z
    .number({ required_error: 'La vigencia es obligatoria' })
    .int()
    .min(2000)
    .max(2100),
  valorTecho: z
    .number({ required_error: 'El valor del techo es obligatorio' })
    .positive('Debe ser mayor a cero'),
  fechaComunicacion: z.string().optional(),
  urlComunicacion: z.string().url('URL inválida').optional().or(z.literal('')),
  observaciones: z.string().max(500).optional(),
});

export type RegistrarTechoInput = z.infer<typeof RegistrarTechoSchema>;

// ── Completar Etapa de Aprobación ─────────────────────────────────────────
// CompletarEtapaCommand: observaciones y urlActa son required en OpenAPI
// pero admiten null — se validan como opcionales con max length
export const CompletarEtapaSchema = z.object({
  observaciones: z
    .string()
    .max(1000, 'Máximo 1000 caracteres')
    .nullable()
    .optional(),
  urlActa: z
    .string()
    .url('URL de acta inválida')
    .nullable()
    .optional()
    .or(z.literal('')),
});

export type CompletarEtapaInput = z.infer<typeof CompletarEtapaSchema>;
