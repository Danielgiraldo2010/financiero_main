// src\features\proyectos\registrar\hook.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { proyectosKeys } from '../model/queryKeys'
import { listarTiposProyecto, registrarProyecto } from './api'
import type { RegistrarProyectoPayload } from '../model/types'

// ── Query key para el catálogo de tipos ──────────────────────
const tiposProyectoKeys = {
  list: (params?: object) =>
    ['catalogos', 'tipos-proyecto', params] as const,
}

// ── Catálogo ──────────────────────────────────────────────────
export function useListarTiposProyecto(params?: {
  categoria?: string
  estado?:    string
}) {
  return useQuery({
    queryKey: tiposProyectoKeys.list(params),
    queryFn:  () =>
      listarTiposProyecto({ ...params, estado: params?.estado ?? 'ACTIVO', tamano: 100 }),
    staleTime: 5 * 60 * 1000, // catálogo estable: 5 min
    select:    (data) => data.items,
  })
}

// ── Registro ──────────────────────────────────────────────────
export function useRegistrarProyecto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: RegistrarProyectoPayload) => registrarProyecto(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: proyectosKeys.lists() })
      toast.success('Proyecto registrado correctamente')
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Error al registrar el proyecto')
    },
  })
}