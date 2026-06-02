// features/identidad/model/types.ts
// Tipos base del dominio identidad -- espejo fiel de v1.json (OpenAPI)
// =============================================================================

// UsuarioSesion -- payload que vive en auth.store (Zustand)
export interface UsuarioSesion {
  id: string
  userName: string
  email: string
  nombreCompleto: string | null
}

// LoginResponse -- espejo exacto de v1.json LoginResponse
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiration: string
  userId: string
  userName: string
  email: string
  roles: string[]
  unidadEjecutoraId: number | null
  esBypassTenant: boolean
}

// UsuarioUnidad -- item de UsuarioResponse.unidades[]
export interface UsuarioUnidad {
  unidadEjecutoraId: number
  unidadEjecutoraNombre: string
  rol: string
  esActivo: boolean
  subDependencia: string | null
  fechaAsignacion: string
  fechaVencimiento: string | null
}

// UsuarioResponse -- GET /auth/me
export interface UsuarioResponse {
  id: string
  userName: string
  email: string
  nombreCompleto: string | null
  activo: boolean
  totp2FaEnabled: boolean
  createdAt: string
  lastLoginAt: string | null
  unidades: UsuarioUnidad[]
}

// Manage2FaResponse -- POST /auth/2fa
export interface Manage2FaResponse {
  habilitado: boolean
  secretKey: string | null
  qrCodeUrl: string | null
}

// LoginCredentials -- body de POST /auth/login
export interface LoginCredentials {
  email: string
  password: string
  codigoTotp?: string | null
}

// UpdatePerfilData -- body de PUT /auth/me
export interface UpdatePerfilData {
  userName?: string
}

// ChangePasswordData -- body de POST /auth/change-password
export interface ChangePasswordData {
  passwordActual: string
  passwordNuevo: string
}
