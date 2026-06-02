import { fetcher } from '@/shared/api/fetcher';
import type { ViaticoSolicitud } from '../../model/types';
import type {
  AprobarViaticoFormValues, AnularFormValues,
  GenerarCdpFormValues, LiquidarViaticoFormValues,
} from '../../model/schema';

export function aprobarViatico(
  id: number, payload: AprobarViaticoFormValues,
): Promise<ViaticoSolicitud> {
  return fetcher(`/api/v1/viaticos/solicitudes/${id}/aprobar`, {
    method: 'POST',
    body:   JSON.stringify({ id, ...payload, numeroResolucion: payload.numeroResolucion ?? null }),
  });
}

export function anularViatico(id: number, payload: AnularFormValues): Promise<ViaticoSolicitud> {
  return fetcher(`/api/v1/viaticos/solicitudes/${id}/anular`, {
    method: 'POST',
    body:   JSON.stringify({ id, ...payload }),
  });
}

export function generarCdpViatico(id: number, payload: GenerarCdpFormValues): Promise<number> {
  return fetcher(`/api/v1/viaticos/solicitudes/${id}/generar-cdp`, {
    method: 'POST',
    body:   JSON.stringify({ id, ...payload }),
  });
}

export function liquidarViatico(
  id: number, payload: LiquidarViaticoFormValues,
): Promise<ViaticoSolicitud> {
  return fetcher(`/api/v1/viaticos/solicitudes/${id}/liquidar`, {
    method: 'POST',
    body:   JSON.stringify({
      id,
      urlSoporte:    payload.urlSoporte    ?? null,
      observaciones: payload.observaciones ?? null,
    }),
  });
}
