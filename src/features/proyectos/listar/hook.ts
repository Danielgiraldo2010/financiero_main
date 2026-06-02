import { useQuery } from '@tanstack/react-query'
import { proyectosKeys } from '../model/queryKeys'
import { getProyectos } from './api'
import type { ListarProyectosParams } from '../model/types'

export function useProyectos(params: ListarProyectosParams = {}) {
  const p: ListarProyectosParams = { Pagina: 1, TamanoPagina: 20, ...params }
  return useQuery({
    queryKey: proyectosKeys.list(p),
    queryFn:  () => getProyectos(p),
  })
}
