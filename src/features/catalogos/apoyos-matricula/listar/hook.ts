import { useQuery } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { listarApoyosMatricula } from "./api"
import type { ListarCatalogosParams } from "../../model/types"

export function useApoyosMatricula(params?: ListarCatalogosParams) {
  return useQuery({
    queryKey: catalogosKeys.apoyosMatriculaList(params),
    queryFn: () => listarApoyosMatricula(params),
  })
}
