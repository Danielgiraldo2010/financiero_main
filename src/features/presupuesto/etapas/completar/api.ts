// features/presupuesto/etapas/completar/api.ts
// POST /api/v1/presupuesto/etapas/{id}/completar
// CompletarEtapaCommand: { id, observaciones, urlActa }
import { fetcher } from '@/shared/api/fetcher';
import type { CompletarEtapaCommand } from '../../model/types';

export async function completarEtapa(
  command: CompletarEtapaCommand,
): Promise<void> {
  await fetcher<void>(
    `/api/v1/presupuesto/etapas/${command.id}/completar`,
    {
      method: 'POST',
      body: JSON.stringify({
        id: command.id,
        observaciones: command.observaciones ?? null,
        urlActa: command.urlActa ?? null,
      }),
    },
  );
}
