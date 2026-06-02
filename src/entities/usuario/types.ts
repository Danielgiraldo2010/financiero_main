// entities/usuario/types.ts
// Tipo de entidad Usuario para uso en capas de UI/tabla
// No extiende UsuarioSesion -- son contratos distintos

export interface UsuarioSesion {
  id: string
  email: string
  nombre: string
  apellido: string
}

export type RolUsuario =
  | 'SUPERADMIN'
  | 'ADMIN_CENTRAL'
  | 'FINANCIERO_CENTRAL'
  | 'DECANO'
  | 'COORDINADOR'
  | 'FINANCIERO'
  | 'CONSULTOR'