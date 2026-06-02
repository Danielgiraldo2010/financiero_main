// src/features/proyectos/cartera/hook.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { carteraKeys } from '../model/queryKeys'
import { listarCartera, registrarFactura } from './api'
import type { ListarCarteraParams, RegistrarFacturaPayload } from '../model/types'

// ─── Listar ───────────────────────────────────────────────────────────────────

export function useCartera(params?: ListarCarteraParams) {
  return useQuery({
    queryKey: carteraKeys.list(params ?? {}),
    queryFn:  () => listarCartera(params),
  })
}

// ─── Registrar factura ────────────────────────────────────────────────────────

export function useRegistrarFactura() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: RegistrarFacturaPayload) => registrarFactura(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: carteraKeys.lists() })
      toast.success('Factura registrada en cartera')
    },
  })
}