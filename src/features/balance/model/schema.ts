import { z } from 'zod'

// --- Cierre ------------------------------------------------------------------
export const iniciarCierreSchema = z.object({
  vigencia: z.coerce.number().int().min(2000).max(2100),
  unidadEjecutoraId: z.coerce.number().int().positive(),
  observaciones: z.string().max(500).optional(),
})

export const aprobarCierreSchema = z.object({
  observaciones: z.string().min(10, 'Requerido minimo 10 caracteres').max(500),
})

// FE10-I1: cerrar es irreversible — el form exige escribir el año
export const cerrarDefinitivoSchema = z.object({
  vigenciaConfirmacion: z.string(),
  urlActaCierre: z.string().url('Ingrese una URL valida del acta'),
})

// --- Recursos de Balance -----------------------------------------------------
export const registrarRecursoSchema = z.object({
  cierreVigenciaId: z.coerce.number().int().positive(),
  vigenciaOrigen: z.coerce.number().int().min(2000).max(2100),
  vigenciaDestino: z.coerce.number().int().min(2000).max(2100),
  unidadEjecutoraId: z.coerce.number().int().positive(),
  tipo: z.string().min(1, 'Requerido'),
  fuenteRecursoId: z.coerce.number().int().positive(),
  rubroOrigenId: z.coerce.number().int().positive().optional(),
  rubroOrigenDescripcion: z.string().max(200).optional(),
  valorIdentificado: z.coerce.number().positive('Debe ser positivo'),
  destinacionEspecifica: z.string().max(500).optional(),
})

export const incorporarRecursoSchema = z.object({
  presupuestoIngresoId: z.coerce.number().int().positive(),
  valorIncorporado: z.coerce.number().positive(),
  fechaIncorporacion: z.string().min(1, 'Requerido'),
  numeroAcuerdo: z.string().min(1).max(50),
  tipoActo: z.string().min(1),
  urlActoAdministrativo: z.string().url().optional().or(z.literal('')),
})

// --- Conciliacion ------------------------------------------------------------
export const registrarConciliacionSchema = z.object({
  recursoBalanceId: z.coerce.number().int().positive(),
  fechaCorte: z.string().min(1, 'Requerido'),
  valorSistema: z.coerce.number().nonnegative(),
  valorTesoreria: z.coerce.number().nonnegative(),
  urlSoporte: z.string().url().optional().or(z.literal('')),
})

export const conciliarBalanceSchema = z.object({
  explicacionDiferencia: z.string().max(500).optional(),
})

// --- Recaudos ----------------------------------------------------------------
export const registrarRecaudoSchema = z.object({
  presupuestoIngresoId: z.coerce.number().int().positive(),
  vigencia: z.coerce.number().int().min(2000).max(2100),
  periodo: z.coerce.number().int().min(1).max(12),
  fechaGiro: z.string().min(1, 'Requerido'),
  numeroGiro: z.string().min(1).max(50),
  entidadPagadora: z.string().min(1).max(200),
  tipoEntidad: z.enum(['NACION', 'DEPARTAMENTO', 'MUNICIPIO', 'PRIVADO', 'OTRO']),
  concepto: z.string().min(1).max(300),
  valor: z.coerce.number().positive('Debe ser positivo'),
  numeroResolucion: z.string().max(50).optional(),
  urlSoporte: z.string().url().optional().or(z.literal('')),
})
