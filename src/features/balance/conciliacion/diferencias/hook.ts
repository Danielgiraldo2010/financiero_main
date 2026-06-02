import { useQuery } from '@tanstack/react-query'
import { balanceKeys } from '../../model/queryKeys'
import { getDiferenciasConciliacion } from './api'

export const useDiferenciasConciliacion = () =>
  useQuery({
    queryKey: balanceKeys.conciliacionDiferencias(),
    queryFn: getDiferenciasConciliacion,
  })
