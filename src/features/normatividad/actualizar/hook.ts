import { useMutation, useQueryClient } from "@tanstack/react-query"
import { normatividadKeys } from "../model/queryKeys"
import { actualizarNorma } from "./api"
import type { ActualizarNormaRequest } from "../model/types"

export const useActualizarNorma = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: ActualizarNormaRequest }) =>
      actualizarNorma(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: normatividadKeys.all })
    },
  })
}
