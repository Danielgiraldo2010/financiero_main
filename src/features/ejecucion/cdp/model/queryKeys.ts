// features/ejecucion/cdp/model/queryKeys.ts
import { ejecucionKeys } from '../../model/queryKeys';

export const cdpKeys = {
  all:    ()         => ejecucionKeys.cdp(),
  lists:  ()         => [...cdpKeys.all(), 'list']        as const,
  list:   (p: object) => [...cdpKeys.lists(), p]          as const,
  detail: (id: number) => [...cdpKeys.all(), 'detail', id] as const,
} as const;
