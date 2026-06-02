import { fetcher } from "@/shared/api/fetcher"
import type { AgendaEventoResponse } from "../model/types"

export const consultarEventoAgenda = (id: number): Promise<AgendaEventoResponse> =>
  fetcher(`/api/v1/agenda/${id}`)
