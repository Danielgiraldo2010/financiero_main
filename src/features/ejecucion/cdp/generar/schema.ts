// features/ejecucion/cdp/generar/schema.ts
import { z } from 'zod';

export const generarCdpSchema = z.object({
  vigencia:          z.number({ required_error: 'Seleccione la vigencia' })
                      .int()
                      .min(2000)
                      .max(2100),
  unidadEjecutoraId: z.number({ required_error: 'Seleccione la unidad ejecutora' }).int().positive(),
  rubroGastoId:      z.number({ required_error: 'Seleccione el rubro de gasto' }).int().positive(),
  fuenteRecursoId:   z.number({ required_error: 'Seleccione la fuente de recurso' }).int().positive(),
  valorSolicitado:   z.number({ required_error: 'Ingrese el valor solicitado' })
                      .positive('El valor debe ser mayor a cero'),
  beneficiario:      z.string().min(3, 'El beneficiario es requerido'),
  objeto:            z.string().optional().nullable(),
  descripcion:       z.string().optional().nullable(),
  urlDocumento:      z.string().url('URL inválida').optional().nullable().or(z.literal('')),
});

export type GenerarCdpFormValues = z.infer<typeof generarCdpSchema>;
