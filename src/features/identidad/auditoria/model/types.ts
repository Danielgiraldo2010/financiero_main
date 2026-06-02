// features/identidad/auditoria/model/types.ts

export interface EventoAuditoria {
  id: number
  usuarioNombre: string | null
  unidadEjecutora: string | null
  accion: string
  descripcion: string | null
  entidadTipo: string | null
  entidadId: string | null
  resultado: string
  detalleError: string | null
  duracionMs: number | null
  ipAddress: string | null
  fechaHora: string
}

// ✅ exactOptionalPropertyTypes: todos los campos opcionales con | undefined explícito.
// Sin esto, pasar campo || undefined desde AuditoriaFilters falla porque
// string | undefined no es asignable a string con esta flag activa.
export interface AuditoriaParams {
  usuarioNombre?: string | undefined
  accion?: string | undefined
  entidadTipo?: string | undefined
  resultado?: string | undefined
  desde?: string | undefined
  hasta?: string | undefined
  page?: number | undefined
  pageSize?: number | undefined
}

export interface ExportarAuditoriaCommand {
  desde?: string | undefined
  hasta?: string | undefined
  usuarioNombre?: string | undefined
  formato?: "xlsx" | "csv" | undefined
}
