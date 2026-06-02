import { useQuery } from '@tanstack/react-query'
import { planClasesKeys } from '../model/queryKeys'
import { listarPlanClases, type ListarPlanClasesParams } from './api'

export function usePlanClases(params?: ListarPlanClasesParams) {
  return useQuery({
    queryKey: planClasesKeys.list(params),
    queryFn:  () => listarPlanClases(params),
  })
}
