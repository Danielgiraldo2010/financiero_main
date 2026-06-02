import { useQuery } from '@tanstack/react-query'
import { balanceKeys } from '../../model/queryKeys'
import { getResumenAnual } from './api'

export const useResumenAnual = (vigencia: number) =>
  useQuery({
    queryKey: balanceKeys.flujoCajaAnual(vigencia),
    queryFn: () => getResumenAnual(vigencia),
    enabled: vigencia >= 2000,
  })
