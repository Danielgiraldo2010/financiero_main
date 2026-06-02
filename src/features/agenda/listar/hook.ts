import { useQuery } from "@tanstack/react-query"
import { agendaKeys } from "../model/queryKeys"
import { listarEventosAgenda } from "./api"
import type { ListarEventosParams } from "./api"

export const useEventosAgenda = (params?: ListarEventosParams) =>
  useQuery({
    queryKey: agendaKeys.lista(),
    queryFn: () => listarEventosAgenda(params),
    staleTime: 60_000,
  })