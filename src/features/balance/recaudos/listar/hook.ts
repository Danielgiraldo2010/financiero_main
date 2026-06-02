import { useQuery } from '@tanstack/react-query'
import { balanceKeys } from '../../model/queryKeys'
import { listarRecaudos } from './api'

export const useRecaudos = (vigencia?: number) =>
  useQuery({ queryKey: balanceKeys.recaudos(vigencia), queryFn: () => listarRecaudos(vigencia) })
