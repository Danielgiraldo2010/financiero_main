import { useQuery } from "@tanstack/react-query"
import { agendaKeys } from "../model/queryKeys"
import { consultarEventoAgenda } from "./api"

export const useEventoAgenda = (id: number) =>
  useQuery({
    queryKey: agendaKeys.detalle(id),
    queryFn: () => consultarEventoAgenda(id),
    enabled: id > 0,
  })
