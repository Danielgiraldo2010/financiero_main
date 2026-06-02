import { fetcher } from '@/shared/api/fetcher';
import type { ViaticoSolicitud } from '../../model/types';

export function consultarViatico(id: number): Promise<ViaticoSolicitud> {
  return fetcher(`/api/v1/viaticos/solicitudes/${id}`);
}
