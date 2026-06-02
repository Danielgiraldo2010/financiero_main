import { useQuery } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { listarFechasLimite } from "./api"
import type { ListarConFiltroParams } from "../../model/types"

export function useFechasLimite(params?: ListarConFiltroParams) {
  return useQuery({
    queryKey: catalogosKeys.fechasLimiteList(params),
    queryFn: () => listarFechasLimite(params),
  })
}
