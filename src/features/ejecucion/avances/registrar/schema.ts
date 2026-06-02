// features/ejecucion/avances/registrar/schema.ts
import { z } from 'zod';

export const registrarAvanceSchema = z.object({
  vigencia:         z.number({ required_error: 'Seleccione la vigencia' }).int().min(2000),
  unidadEjecutoraId: z.number({ required_error: 'Seleccione la unidad ejecutora' }).int().positive(),
  beneficiario:     z.string().min(3, 'El beneficiario es requerido'),
  nitCedula:        z.string().optional().nullable(),
  concepto:         z.string().min(5, 'El concepto es requerido'),
  rubroGastoId:     z.number({ required_error: 'Seleccione el rubro de gasto' }).int().positive(),
  fuenteRecursoId:  z.number({ required_error: 'Seleccione la fuente de recurso' }).int().positive(),
  cdpId:            z.number().int().positive().optional().nullable(),
  valorAvance:      z.number({ required_error: 'Ingrese el valor del avance' }).positive(),
  fechaAvance:      z.string().min(1, 'La fecha del avance es requerida'),
  fechaLimiteLegal: z.string().min(1, 'La fecha límite legal es requerida'),
  urlDocumentoAvance: z.string().url('URL inválida').optional().nullable().or(z.literal('')),
  observaciones:    z.string().optional().nullable(),
});

export type RegistrarAvanceFormValues = z.infer<typeof registrarAvanceSchema>;
