// features/ejecucion/orden-pago/model/queryKeys.ts
import { ejecucionKeys } from '../../model/queryKeys';

export const opKeys = {
  all:    ()           => [...ejecucionKeys.all, 'op']      as const,
  lists:  ()           => [...opKeys.all(), 'list']         as const,
  list:   (p: object)  => [...opKeys.lists(), p]            as const,
  detail: (id: number) => [...opKeys.all(), 'detail', id]   as const,
} as const;
