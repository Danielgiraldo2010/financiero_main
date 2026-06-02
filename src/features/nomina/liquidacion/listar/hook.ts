import { useQuery } from '@tanstack/react-query'
import { liquidacionKeys } from '../model/queryKeys'
import { listarLiquidaciones, type ListarLiquidacionesParams } from './api'

export function useLiquidaciones(params?: ListarLiquidacionesParams) {
  return useQuery({
    queryKey: liquidacionKeys.list(params),
    queryFn:  () => listarLiquidaciones(params),
  })
}
