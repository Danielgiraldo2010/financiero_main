import { fetcher } from '@/shared/api/fetcher';
import type { PagedResult } from '@/shared/api/types';
import type { TarifaViatico } from '../../model/types';

export interface ListarTarifasParams {
  vigencia?:     number;
  tipoPersonal?: string;
  pagina?:       number;
  tamanoPagina?: number;
}

// FIX: el endpoint recibe ?tipo= (no ?tipoPersonal=)
export function listarTarifasViaticos(
  params: ListarTarifasParams = {},
): Promise<PagedResult<TarifaViatico>> {
  const { vigencia, tipoPersonal, pagina = 1, tamanoPagina = 20 } = params;
  const qs = new URLSearchParams();
  if (vigencia)     qs.set('vigencia',     String(vigencia));
  if (tipoPersonal) qs.set('tipo',         tipoPersonal);   // backend espera 'tipo'
  qs.set('pagina',       String(pagina));
  qs.set('tamanoPagina', String(tamanoPagina));
  return fetcher(`/api/v1/viaticos/tarifas?${qs.toString()}`);
}

export function consultarTarifaViatico(id: number): Promise<TarifaViatico> {
  return fetcher(`/api/v1/viaticos/tarifas/${id}`);
}

export interface ActualizarTarifaPayload {
  vigencia:            number;
  tipoPersonal:        string;
  zona:                string;
  municipioTipo:       string;
  incluyePernoctacion: boolean;
  horasMinimasDict:    number | null;
  valorDiaCompleto:    number;
  valorMedioDia:       number;
  valorTransporte:     number;
  normaAplicable:      string;
  vigenteDesde:        string;
  vigenteHasta:        string | null;
}

export function actualizarTarifaViatico(
  id: number,
  payload: ActualizarTarifaPayload,
): Promise<{ updated: boolean }> {
  return fetcher(`/api/v1/viaticos/tarifas/${id}/actualizar`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function desactivarTarifaViatico(id: number): Promise<{ desactivado: boolean }> {
  return fetcher(`/api/v1/viaticos/tarifas/${id}/desactivar`, { method: 'POST' });
}
