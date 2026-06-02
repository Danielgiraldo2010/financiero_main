import type { CoberturaPickResponse, PagedResult } from "../../model/types"
import { fetcher } from "@/shared/api/fetcher"

export async function getCoberturasPic(vigencia?: number): Promise<PagedResult<CoberturaPickResponse>> {
  const qs = new URLSearchParams()
  if (vigencia) qs.set("vigencia", String(vigencia))
  return fetcher<PagedResult<CoberturaPickResponse>>(`/api/v1/matriculas/cobertura-pic?${qs}`)
}
