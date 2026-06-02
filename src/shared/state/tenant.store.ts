// shared/state/tenant.store.ts
import { create } from 'zustand'
import { setTenantId, clearTenantId } from '@/shared/api/tenant/tenant-store'

export interface UnidadEjecutoraBasica {
  id: number
  nombre: string
  codigo?: string
  rol: string
  esActivo: boolean
}

interface TenantState {
  tenantActivo: UnidadEjecutoraBasica | null
  unidadesDisponibles: UnidadEjecutoraBasica[]
  /** true = SUPERADMIN eligió ver datos de todas las UEs sin filtro */
  verTodos: boolean
  cambiarTenant: (ue: UnidadEjecutoraBasica) => void
  setVerTodos: () => void
  setUnidades: (ues: UnidadEjecutoraBasica[]) => void
}

export const useTenantStore = create<TenantState>()((set) => ({
  tenantActivo: null,
  unidadesDisponibles: [],
  verTodos: false,

  cambiarTenant: (ue) => {
    // Al elegir una UE específica: activar filtro por esa UE
    setTenantId(String(ue.id))
    set({ tenantActivo: ue, verTodos: false })
  },

  setVerTodos: () => {
    // Sin X-Tenant-Id → backend devuelve datos de todas las UEs
    clearTenantId()
    set({ tenantActivo: null, verTodos: true })
  },

  setUnidades: (ues) => {
    const activa = ues.find((u) => u.esActivo) ?? ues[0] ?? null
    if (activa) setTenantId(String(activa.id))
    set({
      unidadesDisponibles: ues,
      tenantActivo: activa,
      verTodos: false,
    })
  },
}))