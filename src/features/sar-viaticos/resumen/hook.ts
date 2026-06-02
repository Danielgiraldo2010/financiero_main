import { useQuery } from '@tanstack/react-query';
import { sarViaticosKeys } from '../model/queryKeys';
import { getResumenSarViaticos } from './api';

export function useResumenSarViaticos(vigencia: number) {
  return useQuery({
    queryKey: sarViaticosKeys.resumen(vigencia),
    queryFn:  () => getResumenSarViaticos(vigencia),
    enabled:  vigencia > 0,
  });
}
