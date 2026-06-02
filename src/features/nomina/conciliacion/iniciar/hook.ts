import { useMutation, useQueryClient } from '@tanstack/react-query'
import { conciliacionKeys } from '../model/queryKeys'
import { iniciarConciliacionNomina, type IniciarConciliacionPayload } from './api'

export function useIniciarConciliacion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: IniciarConciliacionPayload) =>
      iniciarConciliacionNomina(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: conciliacionKeys.all() })
    },
  })
}
