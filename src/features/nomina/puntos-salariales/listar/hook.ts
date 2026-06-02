import { useQuery } from '@tanstack/react-query'
import { puntosSalarialesKeys } from '../model/queryKeys'
import { listarPuntosSalariales, type ListarPuntosParams } from './api'

export function usePuntosSalariales(params?: ListarPuntosParams) {
  return useQuery({
    queryKey: puntosSalarialesKeys.list(params),
    queryFn:  () => listarPuntosSalariales(params),
  })
}
