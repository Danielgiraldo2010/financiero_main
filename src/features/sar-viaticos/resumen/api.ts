import { fetcher } from '@/shared/api/fetcher';
import type { ResumenSarViaticos } from '../model/types';

export function getResumenSarViaticos(vigencia: number): Promise<ResumenSarViaticos> {
  return fetcher(`/api/v1/sar-viaticos/resumen?vigencia=${vigencia}`);
}
