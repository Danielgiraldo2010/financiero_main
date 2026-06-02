import { useQuery } from '@tanstack/react-query'
import { balanceKeys } from '../../model/queryKeys'
import { getRecaudo } from './api'

export const useRecaudo = (id: number) =>
  useQuery({ queryKey: balanceKeys.recaudo(id), queryFn: () => getRecaudo(id) })
