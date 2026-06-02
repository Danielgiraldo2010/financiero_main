// features/ejecucion/avances/model/queryKeys.ts
import { ejecucionKeys } from '../../model/queryKeys';

export const avanceKeys = {
  all:    ()           => [...ejecucionKeys.all, 'avances'] as const,
  lists:  ()           => [...avanceKeys.all(), 'list']     as const,
  list:   (p: object)  => [...avanceKeys.lists(), p]        as const,
  detail: (id: number) => [...avanceKeys.all(), 'detail', id] as const,
} as const;
