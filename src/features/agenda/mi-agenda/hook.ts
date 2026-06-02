import { useQuery } from "@tanstack/react-query"
import { agendaKeys } from "../model/queryKeys"
import { getMiAgenda } from "./api"
import type { MiAgendaParams } from "../model/types"

export const useMiAgenda = (params: MiAgendaParams) =>
  useQuery({
    queryKey: agendaKeys.miAgenda(),
    queryFn: () => getMiAgenda(params),
    staleTime: 60_000,
    enabled: !!params.usuarioId,
  })