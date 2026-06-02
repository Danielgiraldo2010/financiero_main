// features/ejecucion/reportes/por-rubro/api.ts
//
// CORRECCIÓN vs plan: devuelve PagedResultOfEjecucionMensualResponse, no un tipo
// específico de sp_ReporteEjecucionDetalladaPorRubro.
// Campos reales: id, vigencia, mes, nombreMes, rubroGasto,
//                presupuestoMensual, ejecutadoMensual, porcentajeEjecucion
import { fetcher } from '@/shared/api/fetcher';
import type { PagedResult } from '@/shared/api/types';
import type { EjecucionMensualRow, ReporteEjecucionPorRubroParams } from '../model/types';

export async function reporteEjecucionPorRubro(
  params: ReporteEjecucionPorRubroParams,
): Promise<PagedResult<EjecucionMensualRow>> {
  const sp = new URLSearchParams();
  sp.set('vigencia', String(params.vigencia));
  if (params.mes)          sp.set('mes',          String(params.mes));
  sp.set('pagina',       String(params.pagina      ?? 1));
  sp.set('tamanoPagina', String(params.tamanoPagina ?? 50));

  return fetcher<PagedResult<EjecucionMensualRow>>(
    `/api/v1/ejecucion/reportes/por-rubro?${sp.toString()}`,
  );
}
