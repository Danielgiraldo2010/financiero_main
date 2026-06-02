import { useQuery } from '@tanstack/react-query'
import { costosParafiscalesKeys } from '../model/queryKeys'
import { listarCostosParafiscales, type ListarCostosParams } from './api'

export function useCostosParafiscales(params?: ListarCostosParams) {
  return useQuery({
    queryKey: costosParafiscalesKeys.list(params),
    queryFn:  () => listarCostosParafiscales(params),
  })
}
