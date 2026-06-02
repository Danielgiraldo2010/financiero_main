import { useQuery } from '@tanstack/react-query'
import { balanceKeys } from '../../model/queryKeys'
import { listarConciliaciones } from './api'

export const useConciliacionesBalance = () =>
  useQuery({ queryKey: balanceKeys.conciliaciones(), queryFn: listarConciliaciones })
