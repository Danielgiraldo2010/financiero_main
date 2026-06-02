// features/ejecucion/reservas/model/queryKeys.ts
import { ejecucionKeys } from '../../model/queryKeys';

export const reservaKeys = {
  all:    ()           => [...ejecucionKeys.all, 'reservas'] as const,
  lists:  ()           => [...reservaKeys.all(), 'list']     as const,
  list:   (p: object)  => [...reservaKeys.lists(), p]        as const,
  detail: (id: number) => [...reservaKeys.all(), 'detail', id] as const,
} as const;
