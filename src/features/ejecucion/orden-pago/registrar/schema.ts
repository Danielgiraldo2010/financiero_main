// features/ejecucion/orden-pago/registrar/schema.ts
import { z } from 'zod';

export const registrarOpSchema = z.object({
  registroPresupuestalId: z.number({ required_error: 'Seleccione el RP' }).int().positive(),
  fechaOrden: z.string().min(1, 'La fecha de la orden es requerida'),
  valor: z.number({ required_error: 'Ingrese el valor' })
          .positive('El valor debe ser mayor a cero'),
  beneficiario: z.string().min(3, 'El beneficiario es requerido'),
  nitCedula:    z.string().min(5, 'El NIT / Cédula es requerido'),
  concepto:     z.string().optional().nullable(),
  urlDocumento: z.string().url('URL inválida').optional().nullable().or(z.literal('')),
});

export type RegistrarOpFormValues = z.infer<typeof registrarOpSchema>;
