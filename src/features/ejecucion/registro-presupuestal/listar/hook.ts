// features/ejecucion/registro-presupuestal/listar/hook.ts
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { PagedResult } from '@/shared/api/types';
import { rpKeys } from '../model/queryKeys';
import { listarRp, type ListarRpParams } from './api';
import type { RegistroPresupuestalResponse } from '../model/types';

const RP_DEFAULTS: Required<Pick<ListarRpParams, 'pagina' | 'tamanoPagina'>> = {
  pagina: 1,
  tamanoPagina: 20,
};

export function useRps(
  params: ListarRpParams = {},
): UseQueryResult<PagedResult<RegistroPresupuestalResponse>> {
  return useQuery({
    queryKey: rpKeys.list(params),
    queryFn:  () => listarRp({ ...RP_DEFAULTS, ...params }),
  });
}
