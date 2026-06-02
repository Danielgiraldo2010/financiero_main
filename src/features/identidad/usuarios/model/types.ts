// ✅ Sin extensión de UsuarioSesion — contratos distintos
export interface Usuario {
  id: string
  userName: string
  email: string
  nombreCompleto: string | null
  activo: boolean
  totp2FaEnabled: boolean          // corregido typo: era totpP2FaEnabled
  createdAt: string
  lastLoginAt: string | null
  unidades: AsignacionUE[]
}

export interface AsignacionUE {
  unidadEjecutoraId: number
  unidadEjecuroraNombre: string
  rol: string
  esActivo: boolean
  subDependencia: string | null
  fechaAsignacion: string
  fechaVencimiento: string | null
}

// ✅ exactOptionalPropertyTypes: campos opcionales deben declarar | undefined
export interface UsuariosParams {
  email?: string | undefined
  activo?: boolean | undefined
  rol?: string | undefined
  page?: number | undefined
  pageSize?: number | undefined
}

export interface AsignarUECommand {
  usuarioId: string
  unidadEjecutoraId: number
  rol: string
  subDependencia: string | null
  fechaVencimiento: string | null
}

export interface CrearUsuarioCommand {
  email: string
  userName: string
  password: string
  nombreCompleto: string | null
  unidadEjecutoraId: number
  rol: string
}

// ✅ Alineado con ModificarUsuarioBody de api.ts
// nombreCompleto es null permitido (campo opcional en UI)
export interface ModificarUsuarioCommand {
  email: string
  userName: string
  nombreCompleto: string | null
}