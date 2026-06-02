// src/features/proyectos/contratos/hook.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { contratosKeys } from '../model/queryKeys'
import {
  anularContrato,
  listarContratos,
  registrarContrato,
  registrarPagoContrato,
} from './api'
import type {
  ListarContratosParams,
  RegistrarContratoPayload,
  RegistrarPagoPayload,
} from '../model/types'

// ─── Listar ───────────────────────────────────────────────────────────────────

export function useContratos(params?: ListarContratosParams) {
  return useQuery({
    queryKey: contratosKeys.list(params ?? {}),
    queryFn:  () => listarContratos(params),
  })
}

// ─── Registrar ────────────────────────────────────────────────────────────────

export function useRegistrarContrato() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: RegistrarContratoPayload) => registrarContrato(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contratosKeys.lists() })
      toast.success('Contrato registrado correctamente')
    },
  })
}

// ─── Anular ───────────────────────────────────────────────────────────────────

export function useAnularContrato() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => anularContrato(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contratosKeys.lists() })
      toast.success('Contrato anulado')
    },
  })
}

// ─── Registrar pago ───────────────────────────────────────────────────────────

export function useRegistrarPagoContrato() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      contratoId,
      payload,
    }: {
      contratoId: number
      payload: RegistrarPagoPayload
    }) => registrarPagoContrato(contratoId, payload),
    onSuccess: (_data, { contratoId }) => {
      qc.invalidateQueries({ queryKey: contratosKeys.detail(contratoId) })
      qc.invalidateQueries({ queryKey: contratosKeys.lists() })
      toast.success('Pago registrado correctamente')
    },
  })
}