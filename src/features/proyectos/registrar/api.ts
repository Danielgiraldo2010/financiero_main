// src\features\proyectos\registrar\api.ts
import { fetcher } from '@/shared/api/fetcher'
import type { Proyecto, TipoProyecto, RegistrarProyectoPayload } from '../model/types'

// ── Catálogo de tipos de proyecto ─────────────────────────────
export async function listarTiposProyecto(params?: {
  categoria?: string
  estado?:    string
  pagina?:    number
  tamano?:    number
}): Promise<{ items: TipoProyecto[]; total: number }> {
  const qs = new URLSearchParams()
  if (params?.categoria) qs.set('Categoria', params.categoria)
  if (params?.estado)    qs.set('Estado',    params.estado)
  if (params?.pagina)    qs.set('Pagina',    String(params.pagina))
  if (params?.tamano)    qs.set('Tamano',    String(params.tamano))
  const query = qs.toString() ? `?${qs}` : ''
  return fetcher(`/api/v1/catalogos/tipos-proyecto${query}`)
}

// ── Registro de proyecto ──────────────────────────────────────
export async function registrarProyecto(
  payload: RegistrarProyectoPayload
): Promise<Proyecto> {
  return fetcher<Proyecto>('/api/v1/proyectos', {
    method: 'POST',
    body:   JSON.stringify(payload),
  })
}