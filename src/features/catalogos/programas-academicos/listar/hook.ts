import { useQuery } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { listarProgramasAcademicos } from "./api"
import type { ListarCatalogosParams } from "../../model/types"

export function useProgramasAcademicos(params?: ListarCatalogosParams) {
  return useQuery({
    queryKey: catalogosKeys.programasAcademicosList(params),
    queryFn: () => listarProgramasAcademicos(params),
  })
}
