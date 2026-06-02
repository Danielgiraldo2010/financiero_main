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
  BORRADOR: 'bg-gray-100 text-gray-700',
  EN_REVISION: 'bg-yellow-100 text-yellow-700',
  APROBADO: 'bg-blue-100 text-blue-700',
  CERRADO: 'bg-green-100 text-green-700',
}

export const ESTADO_RECURSO_LABEL: Record<string, string> = {
  IDENTIFICADO: 'Identificado',
  VALIDADO: 'Validado',
  INCORPORADO: 'Incorporado',
  EJECUTADO: 'Ejecutado',
}

export const ESTADO_RECURSO_COLOR: Record<string, string> = {
  IDENTIFICADO: 'bg-gray-100 text-gray-700',
  VALIDADO: 'bg-blue-100 text-blue-700',
  INCORPORADO: 'bg-green-100 text-green-700',
  EJECUTADO: 'bg-purple-100 text-purple-700',
}

export const ESTADO_CONCILIACION_COLOR: Record<string, string> = {
  PENDIENTE: 'bg-yellow-100 text-yellow-700',
  CONCILIADO: 'bg-green-100 text-green-700',
  CON_DIFERENCIA: 'bg-red-100 text-red-700',
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
