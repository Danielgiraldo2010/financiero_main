import { useQuery } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { listarFuentesRecursos } from "./api"
import type { ListarCatalogosParams } from "../../model/types"

export function useFuentesRecursos(params?: ListarCatalogosParams) {
  return useQuery({
    queryKey: catalogosKeys.fuentesRecursosList(params),
    queryFn: () => listarFuentesRecursos(params),
  })
}
