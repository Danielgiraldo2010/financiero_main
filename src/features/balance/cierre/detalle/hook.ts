import { useQuery } from '@tanstack/react-query'
import { balanceKeys } from '../../model/queryKeys'
import { getCierre } from './api'

export const useCierre = (id: number) =>
  useQuery({ queryKey: balanceKeys.cierre(id), queryFn: () => getCierre(id) })
