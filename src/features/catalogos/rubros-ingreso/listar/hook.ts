import { useQuery } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { listarRubrosIngreso } from "./api"
import type { ListarCatalogosParams } from "../../model/types"

export function useRubrosIngreso(params?: ListarCatalogosParams) {
  return useQuery({
    queryKey: catalogosKeys.rubrosIngresoList(params),
    queryFn: () => listarRubrosIngreso(params),
  })
}
