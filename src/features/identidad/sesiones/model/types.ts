export interface Sesion {
  id: string
  usuarioId: string
  usuarioNombre: string
  ipAddress: string | null
  fechaInicio: string
  fechaExpiracion: string
  esActiva: boolean
}
