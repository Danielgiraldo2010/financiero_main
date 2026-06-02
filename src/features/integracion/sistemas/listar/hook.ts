// features/integracion/sistemas/listar/hook.ts

import { useQuery } from "@tanstack/react-query"
import { integracionKeys } from "../../model/queryKeys"
import { listarSistemas } from "./api"
import type { ListarSistemasParams } from "./api"

export function useListarSistemas(params: ListarSistemasParams = {}) {
  return useQuery({
    queryKey: [...integracionKeys.sistemas(), params],
    queryFn: () => listarSistemas(params),
    select: (data) => data.items,
  })
}