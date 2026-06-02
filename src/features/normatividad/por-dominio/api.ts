import { fetcher } from "@/shared/api/fetcher"
import type { NormaPorDominioResponse } from "../model/types"

export const getNormasPorDominio = (
  dominio: string
): Promise<NormaPorDominioResponse[]> =>
  fetcher(`/api/v1/normatividad/por-dominio/${dominio}`)
