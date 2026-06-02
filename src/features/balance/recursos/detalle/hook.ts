import { useQuery } from '@tanstack/react-query'
import { balanceKeys } from '../../model/queryKeys'
import { getRecursoBalance } from './api'

export const useRecursoBalance = (id: number) =>
  useQuery({ queryKey: balanceKeys.recurso(id), queryFn: () => getRecursoBalance(id) })
