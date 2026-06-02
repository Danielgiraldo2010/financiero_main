// features/ejecucion/registro-presupuestal/model/queryKeys.ts
import { ejecucionKeys } from '../../model/queryKeys';

export const rpKeys = {
  all:    ()          => ejecucionKeys.rp(),
  lists:  ()          => [...rpKeys.all(), 'list']         as const,
  list:   (p: object) => [...rpKeys.lists(), p]            as const,
  detail: (id: number) => [...rpKeys.all(), 'detail', id]  as const,
  saldo:  (id: number) => [...rpKeys.all(), 'saldo',  id]  as const,
} as const;
