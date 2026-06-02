// features/ejecucion/radicacion/registrar/schema.ts
import { z } from 'zod';

export const registrarRadicacionSchema = z.object({
  vigencia:          z.number({ required_error: 'Seleccione la vigencia' }).int().min(2000),
  unidadEjecutoraId: z.number({ required_error: 'Seleccione la unidad ejecutora' }).int().positive(),
  tipoCuenta:        z.string().min(1, 'Seleccione el tipo de cuenta'),
  proveedorNombre:   z.string().min(3, 'El nombre del proveedor es requerido'),
  proveedorNit:      z.string().optional().nullable(),
  concepto:          z.string().min(5, 'El concepto es requerido'),
  valorBruto:        z.number({ required_error: 'Ingrese el valor bruto' }).positive(),
  valorRetenciones:  z.number({ required_error: 'Ingrese las retenciones' }).min(0),
  cdpId:             z.number().int().positive().optional().nullable(),
  registroPresupuestalId: z.number().int().positive().optional().nullable(),
  observaciones:     z.string().optional().nullable(),
  urlDocumento:      z.string().url('URL inválida').optional().nullable().or(z.literal('')),
}).refine(
  (d) => d.valorRetenciones < d.valorBruto,
  { message: 'Las retenciones no pueden superar el valor bruto', path: ['valorRetenciones'] },
);

export type RegistrarRadicacionFormValues = z.infer<typeof registrarRadicacionSchema>;
