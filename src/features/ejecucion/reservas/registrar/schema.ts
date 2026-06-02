// features/ejecucion/reservas/registrar/schema.ts
import { z } from 'zod';

export const registrarReservaSchema = z.object({
  tipo:             z.string().min(1, 'El tipo es requerido'),
  vigenciaOrigen:   z.number({ required_error: 'Seleccione la vigencia origen' }).int().min(2000),
  vigenciaDestino:  z.number({ required_error: 'Seleccione la vigencia destino' }).int().min(2000),
  unidadEjecutoraId: z.number({ required_error: 'Seleccione la unidad ejecutora' }).int().positive(),
  cdpId:            z.number().int().positive().optional().nullable(),
  registroPresupuestalId: z.number().int().positive().optional().nullable(),
  rubroGastoId:     z.number({ required_error: 'Seleccione el rubro de gasto' }).int().positive(),
  fuenteRecursoId:  z.number({ required_error: 'Seleccione la fuente de recurso' }).int().positive(),
  valor:            z.number({ required_error: 'Ingrese el valor' }).positive(),
  beneficiario:     z.string().optional().nullable(),
  concepto:         z.string().optional().nullable(),
  justificacion:    z.string().optional().nullable(),
  urlDocumento:     z.string().url('URL inválida').optional().nullable().or(z.literal('')),
});

export type RegistrarReservaFormValues = z.infer<typeof registrarReservaSchema>;
