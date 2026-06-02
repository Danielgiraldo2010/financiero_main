import { useQuery } from '@tanstack/react-query'
import { balanceKeys } from '../../model/queryKeys'
import { listarRecursos } from './api'

export const useRecursosBalance = (vigencia?: number) =>
  useQuery({
    queryKey: balanceKeys.recursos(vigencia),
    queryFn: () => listarRecursos(vigencia),
  })
