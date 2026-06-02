import { useQuery } from '@tanstack/react-query'
import { balanceKeys } from '../../model/queryKeys'
import { listarCierres } from './api'

export const useCierres = () =>
  useQuery({ queryKey: balanceKeys.cierres(), queryFn: listarCierres })
