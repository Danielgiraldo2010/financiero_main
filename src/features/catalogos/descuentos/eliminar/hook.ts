import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { eliminarDescuento } from "./api"
export function useEliminarDescuento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => eliminarDescuento(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.descuentos() }) },
  })
}