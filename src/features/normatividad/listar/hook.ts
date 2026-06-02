import { useQuery } from "@tanstack/react-query"
import { normatividadKeys } from "../model/queryKeys"
import { listarNormas } from "./api"
import type { ListarNormasParams } from "../model/types"

export const useNormatividad = (params?: ListarNormasParams) =>
  useQuery({
    queryKey: normatividadKeys.lista(params),
    queryFn: () => listarNormas(params),
    staleTime: 120_000,
  })
