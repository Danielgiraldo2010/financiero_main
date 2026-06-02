// shared/state/ui.store.ts
// G13: vigenciaActiva global -- puede sincronizarse con query params
import { create } from 'zustand'

interface UIState {
  vigenciaActiva: number
  sidebarOpen: boolean
  setVigencia: (v: number) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()((set) => ({
  vigenciaActiva: new Date().getFullYear(),
  sidebarOpen: true,
  setVigencia: (v) => set({ vigenciaActiva: v }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
