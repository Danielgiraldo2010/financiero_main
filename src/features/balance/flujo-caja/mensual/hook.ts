import { useQuery } from '@tanstack/react-query'
import { balanceKeys } from '../../model/queryKeys'
import { getFlujoCajaMensual } from './api'

export const useFlujoCajaMensual = (vigencia: number, mes: number) =>
  useQuery({
    queryKey: balanceKeys.flujoCajaMensual(vigencia, mes),
    queryFn: () => getFlujoCajaMensual(vigencia, mes),
    enabled: mes >= 1 && mes <= 12,
  })
