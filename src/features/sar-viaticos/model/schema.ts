import { z } from 'zod';
import { SAR_HORAS_MAX, FUENTES_SAR, TIPOS_SAR, TIPOS_PERSONAL_VIATICO,
         ZONAS_VIATICO, MUNICIPIO_TIPOS } from './constants';

// ─────────────────────────────────────────────────────────────────────────────
// SAR
// ─────────────────────────────────────────────────────────────────────────────

export const RegistrarSarSchema = z.object({
  vigencia:           z.number().int().min(2020).max(2099),
  proyectoId:         z.number().int().positive(),
  empleadoId:         z.number().int().positive(),
  tipoSar:            z.enum(TIPOS_SAR, { message: 'Seleccione el tipo de SAR' }),
  descripcion:        z.string().min(10, 'Mínimo 10 caracteres').max(500),
  horasAprobadas:     z.number().int().min(1, 'Mínimo 1 hora')
                       .max(SAR_HORAS_MAX, `Máximo ${SAR_HORAS_MAX} horas (Acuerdo 44/2017)`),
  valorHora:          z.number().positive('Valor por hora requerido'),
  fuenteFinanciacion: z.enum(FUENTES_SAR, { message: 'Seleccione la fuente de financiación' }),
});

export type RegistrarSarFormValues = z.input<typeof RegistrarSarSchema>;

export const AprobarSarSchema = z.object({
  numeroResolucionDec: z.string().min(1, 'Número de resolución requerido'),
  fechaResolucion:     z.string().min(1, 'Fecha de resolución requerida'),
  urlResolucion:       z.string().url('URL inválida').nullable().optional(),
});

export type AprobarSarFormValues = z.input<typeof AprobarSarSchema>;

export const AnularSchema = z.object({
  motivo: z.string().min(10, 'Describa el motivo (mín. 10 caracteres)').max(500),
});

export type AnularFormValues = z.input<typeof AnularSchema>;

export const EjecutarSarSchema = z.object({
  horasEjecutadas: z.number().int().min(1, 'Mínimo 1 hora')
                    .max(SAR_HORAS_MAX, `Máximo ${SAR_HORAS_MAX} horas`),
});

export type EjecutarSarFormValues = z.input<typeof EjecutarSarSchema>;

export const GenerarCdpSchema = z.object({
  rubroGastoId:    z.number().int().positive('Seleccione el rubro de gasto'),
  fuenteRecursoId: z.number().int().positive('Seleccione la fuente de recurso'),
});

export type GenerarCdpFormValues = z.input<typeof GenerarCdpSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Viáticos — Tarifas
// ─────────────────────────────────────────────────────────────────────────────

export const RegistrarTarifaViaticoSchema = z.object({
  vigencia:            z.number().int().min(2020).max(2099),
  tipoPersonal:        z.enum(TIPOS_PERSONAL_VIATICO),
  zona:          z.enum(ZONAS_VIATICO,   { message: 'Seleccione la zona' }),
  municipioTipo: z.enum(MUNICIPIO_TIPOS, { message: 'Seleccione el tipo de municipio' }),
  incluyePernoctacion: z.boolean(),
  horasMinimasDict:    z.number().int().nullable().optional(),
  valorDiaCompleto:    z.number().positive('Valor día completo requerido'),
  valorMedioDia:       z.number().positive('Valor medio día requerido'),
  valorTransporte:     z.number().min(0),
  normaAplicable:      z.string().min(1, 'Norma aplicable requerida'),
  vigenteDesde:        z.string().min(1),
  vigenteHasta:        z.string().nullable().optional(),
});

export type RegistrarTarifaViaticoFormValues = z.input<typeof RegistrarTarifaViaticoSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Viáticos — Solicitud
// ─────────────────────────────────────────────────────────────────────────────

export const RegistrarViaticoSchema = z.object({
  vigencia:            z.number().int().min(2020).max(2099),
  proyectoId:          z.number().int().positive(),
  unidadEjecutoraId:   z.number().int().positive(),
  empleadoId:          z.number().int().positive(),
  tipoPersonal:        z.enum(TIPOS_PERSONAL_VIATICO),
  municipioDestinoId:  z.number().int().positive('Seleccione el municipio destino'),
  fechaSalida:         z.string().min(1, 'Fecha de salida requerida'),
  fechaRegreso:        z.string().min(1, 'Fecha de regreso requerida'),
  incluyePernoctacion: z.boolean(),
  horasEfectivasDict:  z.number().int().min(1).nullable().optional(),
  observaciones:       z.string().max(500).nullable().optional(),
}).superRefine((val, ctx) => {
  if (val.tipoPersonal === 'CATEDRATICO_AC44' && !val.horasEfectivasDict) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['horasEfectivasDict'],
      message: 'Horas efectivas requeridas para catedráticos (dictado)',
    });
  }
});

export type RegistrarViaticoFormValues = z.input<typeof RegistrarViaticoSchema>;

export const AprobarViaticoSchema = z.object({
  valorAprobado:    z.number().positive('Valor aprobado requerido'),
  numeroResolucion: z.string().nullable().optional(),
});

export type AprobarViaticoFormValues = z.input<typeof AprobarViaticoSchema>;

export const LiquidarViaticoSchema = z.object({
  urlSoporte:    z.string().url('URL inválida').nullable().optional(),
  observaciones: z.string().max(500).nullable().optional(),
});

export type LiquidarViaticoFormValues = z.input<typeof LiquidarViaticoSchema>;
