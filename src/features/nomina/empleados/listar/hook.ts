import { useQuery } from '@tanstack/react-query'
import { empleadosKeys } from '../model/queryKeys'
import { listarEmpleados, type ListarEmpleadosParams } from './api'

export function useEmpleados(params?: ListarEmpleadosParams) {
  return useQuery({
    queryKey: empleadosKeys.list(params),
    queryFn:  () => listarEmpleados(params),
  })
}
