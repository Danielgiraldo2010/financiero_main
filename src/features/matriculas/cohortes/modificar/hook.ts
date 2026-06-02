import { useMutation, useQueryClient } from "@tanstack/react-query"
import { modificarCohorte } from "./api"
import { matriculasKeys } from "../../model/queryKeys"

export function useModificarCohorte() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: { id: number } & Omit<import("../../model/types").ModificarCohorteCommand, "id">) =>
      modificarCohorte(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: matriculasKeys.all })
    },
  })
}
