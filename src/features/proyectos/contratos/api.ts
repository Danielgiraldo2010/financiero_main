// src/features/proyectos/contratos/api.ts
import { fetcher } from '@/shared/api/fetcher'
import type {
  ContratoResponse,
  PagoContratoResponse,
  ListarContratosParams,
  RegistrarContratoPayload,
  RegistrarPagoPayload,
  PagedContratos,
} from '../model/types'

// ─── Listar ───────────────────────────────────────────────────────────────────

export async function listarContratos(
  params?: ListarContratosParams,
): Promise<PagedContratos> {
  const sp = new URLSearchParams()
  if (params?.Pagina)            sp.set('Pagina',            String(params.Pagina))
  if (params?.TamanoPagina)      sp.set('TamanoPagina',      String(params.TamanoPagina))
  if (params?.Vigencia)          sp.set('Vigencia',          String(params.Vigencia))
  if (params?.UnidadEjecutoraId) sp.set('UnidadEjecutoraId', String(params.UnidadEjecutoraId))
  if (params?.Estado)            sp.set('Estado',            params.Estado)

  const data = await fetcher<{
    items:        unknown[]
    totalItems:   number
    pagina:       number
    tamanoPagina: number
  }>(`/api/v1/proyectos/contratos?${sp.toString()}`)

  return {
    items:          data.items as ContratoResponse[],
    totalRegistros: data.totalItems,
    pagina:         data.pagina,
    tamanoPagina:   data.tamanoPagina,
  }
}

// ─── Registrar ────────────────────────────────────────────────────────────────

export function registrarContrato(
  payload: RegistrarContratoPayload,
): Promise<ContratoResponse> {
  return fetcher<ContratoResponse>('/api/v1/proyectos/contratos', {
    method: 'POST',
    body:   JSON.stringify(payload),
  })
}

// ─── Anular ───────────────────────────────────────────────────────────────────

export function anularContrato(id: number): Promise<boolean> {
  return fetcher<boolean>(`/api/v1/proyectos/contratos/${id}/anular`, {
    method: 'POST',
    body:   JSON.stringify({ id }),
  })
}

// ─── Registrar pago ───────────────────────────────────────────────────────────

export function registrarPagoContrato(
  contratoId: number,
  payload: RegistrarPagoPayload,
): Promise<PagoContratoResponse> {
  return fetcher<PagoContratoResponse>(
    `/api/v1/proyectos/contratos/${contratoId}/pagos`,
    {
      method: 'POST',
      body:   JSON.stringify(payload),
    },
  )
}