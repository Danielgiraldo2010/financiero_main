import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { modificarDescuento } from "./api"
export function useModificarDescuento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: modificarDescuento,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.descuentos() }) },
  })
}