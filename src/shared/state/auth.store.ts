// shared/state/auth.store.ts
// G4: Zustand SOLO para auth -- datos del servidor van en TanStack Query
// Definicion local de UsuarioSesion para evitar dependencia circular
// La interfaz canonica esta en features/identidad/model/types.ts
import { create } from 'zustand'

export interface UsuarioSesion {
  id: string
  userName: string
  email: string
  nombreCompleto: string | null
}

interface AuthState {
  user: UsuarioSesion | null
  roles: string[]
  isAuthenticated: boolean
  login: (user: UsuarioSesion, token: string) => void
  logout: () => void
  setRoles: (roles: string[]) => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  roles: [],
  isAuthenticated: false,
  login: (user, _token) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, roles: [], isAuthenticated: false }),
  setRoles: (roles) => set({ roles }),
}))
