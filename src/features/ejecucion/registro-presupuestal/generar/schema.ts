// features/ejecucion/registro-presupuestal/generar/schema.ts
import { z } from 'zod';

export const generarRpSchema = z.object({
  cdpId:       z.number({ required_error: 'Seleccione el CDP' }).int().positive(),
  valorTotal:  z.number({ required_error: 'Ingrese el valor total' })
                .positive('El valor debe ser mayor a cero'),
  beneficiario: z.string().min(3, 'El beneficiario es requerido'),
  nitCedula:    z.string().min(5, 'El NIT / Cédula es requerido'),
  descripcion:  z.string().optional().nullable(),
  urlDocumento: z.string().url('URL inválida').optional().nullable().or(z.literal('')),
});

export type GenerarRpFormValues = z.infer<typeof generarRpSchema>;
