export const TIPOS_EVENTO = [
  "FECHA_LIMITE",
  "COMPROMISO",
  "RECORDATORIO",
  "REUNION",
  "OTRO",
] as const

export const PRIORIDADES_EVENTO = ["ALTA", "MEDIA", "BAJA"] as const

export const ESTADOS_EVENTO = [
  "PENDIENTE",
  "EN_PROGRESO",
  "COMPLETADO",
  "CANCELADO",
] as const

export const SEMAFORO_ESTADO: Record<string, string> = {
  PENDIENTE: "text-yellow-600 bg-yellow-50",
  EN_PROGRESO: "text-blue-600 bg-blue-50",
  COMPLETADO: "text-green-600 bg-green-50",
  CANCELADO: "text-gray-500 bg-gray-100",
}

export const LABEL_ESTADO: Record<string, string> = {
  PENDIENTE: "Pendiente",
  EN_PROGRESO: "En progreso",
  COMPLETADO: "Completado",
  CANCELADO: "Cancelado",
}
