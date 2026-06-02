import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { crearDescuento } from "./api"
export function useCrearDescuento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: crearDescuento,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.descuentos() }) },
  })
}