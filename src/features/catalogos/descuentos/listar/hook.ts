import { useQuery } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { listarDescuentos } from "./api"
import type { ListarCatalogosParams } from "../../model/types"

export function useDescuentos(params?: ListarCatalogosParams) {
  return useQuery({
    queryKey: catalogosKeys.descuentosList(params),
    queryFn: () => listarDescuentos(params),
  })
}
