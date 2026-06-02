// src/features/proyectos/cartera/api.ts
import { fetcher } from '@/shared/api/fetcher'
import type {
  CarteraFacturaResponse,
  ListarCarteraParams,
  RegistrarFacturaPayload,
  PagedCartera,
} from '../model/types'

// ─── Listar ───────────────────────────────────────────────────────────────────

export async function listarCartera(
  params?: ListarCarteraParams,
): Promise<PagedCartera> {
  const sp = new URLSearchParams()
  if (params?.Pagina)            sp.set('Pagina',            String(params.Pagina))
  if (params?.TamanoPagina)      sp.set('TamanoPagina',      String(params.TamanoPagina))
  if (params?.Vigencia)          sp.set('Vigencia',          String(params.Vigencia))
  if (params?.UnidadEjecutoraId) sp.set('UnidadEjecutoraId', String(params.UnidadEjecutoraId))
  if (params?.Estado)            sp.set('Estado',            params.Estado)
  if (params?.SoloMora)          sp.set('SoloMora',          'true')

  const data = await fetcher<{
    items:        unknown[]
    totalItems:   number
    pagina:       number
    tamanoPagina: number
  }>(`/api/v1/proyectos/cartera?${sp.toString()}`)

  return {
    items:          data.items as CarteraFacturaResponse[],
    totalRegistros: data.totalItems,
    pagina:         data.pagina,
    tamanoPagina:   data.tamanoPagina,
  }
}

// ─── Registrar factura ────────────────────────────────────────────────────────

export function registrarFactura(
  payload: RegistrarFacturaPayload,
): Promise<CarteraFacturaResponse> {
  return fetcher<CarteraFacturaResponse>('/api/v1/proyectos/cartera', {
    method: 'POST',
    body:   JSON.stringify(payload),
  })
}