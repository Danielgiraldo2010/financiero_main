import { fetcher } from '@/shared/api/fetcher'
import type { ListarProyectosParams, PagedProyectos } from '../model/types'

export async function getProyectos(params: ListarProyectosParams): Promise<PagedProyectos> {
  const sp = new URLSearchParams()
  if (params.Pagina)            sp.set('Pagina',            String(params.Pagina))
  if (params.TamanoPagina)      sp.set('TamanoPagina',      String(params.TamanoPagina))
  if (params.Q)                 sp.set('Q',                 params.Q)
  if (params.Vigencia)          sp.set('Vigencia',          String(params.Vigencia))
  if (params.TipoProyectoId)    sp.set('TipoProyectoId',    String(params.TipoProyectoId))
  if (params.EstadoPresupuesto) sp.set('EstadoPresupuesto', params.EstadoPresupuesto)
  if (params.Estado)            sp.set('Estado',            params.Estado)
  if (params.UnidadEjecutoraId) sp.set('UnidadEjecutoraId', String(params.UnidadEjecutoraId))

  const data = await fetcher<{
    items: unknown[]
    totalItems: number
    pagina: number
    tamanoPagina: number
  }>(`/api/v1/proyectos?${sp.toString()}`)

  return {
    items:          data.items as PagedProyectos['items'],
    totalRegistros: data.totalItems,   // totalItems → totalRegistros
    pagina:         data.pagina,
    tamanoPagina:   data.tamanoPagina,
  }
}
