import { useMutation, useQueryClient } from '@tanstack/react-query'
import { puntosSalarialesKeys } from '../model/queryKeys'
import { registrarPuntosSalariales, type RegistrarPuntosPayload } from './api'

export function useRegistrarPuntosSalariales() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: RegistrarPuntosPayload) =>
      registrarPuntosSalariales(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: puntosSalarialesKeys.all() })
    },
  })
}
