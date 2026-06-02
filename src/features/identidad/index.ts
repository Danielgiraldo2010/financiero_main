// features/identidad/index.ts
// Re-exports publicos del dominio identidad
// FE1-B importa desde aqui -- nunca desde subdirectorios directamente

// Tipos
export type {
  UsuarioSesion,
  LoginResponse,
  UsuarioResponse,
  UsuarioUnidad,
  Manage2FaResponse,
  LoginCredentials,
  UpdatePerfilData,
  ChangePasswordData,
} from './model/types'

// Hooks
export { useLogin } from './auth/login/hook'
export { useLogout } from './auth/logout/hook'
export { useMiPerfil, useUpdatePerfil, useChangePassword } from './auth/perfil/hook'
export { useEnable2FA, useDisable2FA } from './auth/dos-factores/hook'

// APIs expuestas para uso desde interceptors o FE1-B
export { getMiPerfil } from './auth/perfil/api'
export { refreshToken } from './auth/refresh/api'
