import { useMutation, useQueryClient } from '@tanstack/react-query'
import { balanceKeys } from '../../model/queryKeys'
import { validarRecurso, incorporarRecurso } from './api'

export const useValidarRecurso = (id: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => validarRecurso(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: balanceKeys.recurso(id) })
      qc.invalidateQueries({ queryKey: balanceKeys.recursos() })
    },
  })
}

export const useIncorporarRecurso = (id: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Omit<Parameters<typeof incorporarRecurso>[0], 'id'>) =>
      incorporarRecurso({ id, ...body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: balanceKeys.recurso(id) })
      qc.invalidateQueries({ queryKey: balanceKeys.recursos() })
    },
  })
}
