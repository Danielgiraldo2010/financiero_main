export const ESTADO_CIERRE = {
  BORRADOR: 'BORRADOR',
  EN_REVISION: 'EN_REVISION',
  APROBADO: 'APROBADO',
  CERRADO: 'CERRADO',
} as const

export const ESTADO_CIERRE_LABEL: Record<string, string> = {
  BORRADOR: 'Borrador',
  EN_REVISION: 'En revision',
  APROBADO: 'Aprobado',
  CERRADO: 'Cerrado',
}

export const ESTADO_CIERRE_COLOR: Record<string, string> = {
  BORRADOR: 'bg-slate-100 text-slate-800',
  EN_REVISION: 'bg-amber-100 text-amber-800',
  APROBADO: 'bg-blue-100 text-blue-800',
  CERRADO: 'bg-emerald-100 text-emerald-800',
}

export const ESTADO_RECURSO_LABEL: Record<string, string> = {
  IDENTIFICADO: 'Identificado',
  VALIDADO: 'Validado',
  INCORPORADO: 'Incorporado',
  EJECUTADO: 'Ejecutado',
}

export const ESTADO_RECURSO_COLOR: Record<string, string> = {
  IDENTIFICADO: 'bg-slate-100 text-slate-800',
  VALIDADO: 'bg-blue-100 text-blue-800',
  INCORPORADO: 'bg-emerald-100 text-emerald-800',
  EJECUTADO: 'bg-violet-100 text-violet-800',
}

export const ESTADO_CONCILIACION_COLOR: Record<string, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-800',
  CONCILIADO: 'bg-emerald-100 text-emerald-800',
  CON_DIFERENCIA: 'bg-red-100 text-red-800',
}

export const TIPOS_ENTIDAD = ['NACION', 'DEPARTAMENTO', 'MUNICIPIO', 'PRIVADO', 'OTRO'] as const

export const TIPOS_RECURSO_BALANCE = [
  'SUPERAVIT',
  'RESERVA_PRESUPUESTAL',
  'CUENTAS_POR_PAGAR',
  'EXCEDENTE_FINANCIERO',
] as const

// FE10-I2: umbral diferencias conciliacion
export const UMBRAL_DIFERENCIA_CONCILIACION = 1_000_000 // $1.000.000 COP

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
