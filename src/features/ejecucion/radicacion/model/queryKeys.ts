// features/ejecucion/radicacion/model/queryKeys.ts
import { ejecucionKeys } from '../../model/queryKeys';

export const radicacionKeys = {
  all:    ()           => [...ejecucionKeys.all, 'radicacion'] as const,
  lists:  ()           => [...radicacionKeys.all(), 'list']    as const,
  list:   (p: object)  => [...radicacionKeys.lists(), p]       as const,
  detail: (id: number) => [...radicacionKeys.all(), 'detail', id] as const,
} as const;
