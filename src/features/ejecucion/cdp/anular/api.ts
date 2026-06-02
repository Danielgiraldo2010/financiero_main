// features/ejecucion/cdp/anular/api.ts
import { fetcher } from '@/shared/api/fetcher';
import type { AnularCdpCommand } from '../model/types';

export async function anularCdp(command: AnularCdpCommand): Promise<void> {
  await fetcher<void>(`/api/v1/ejecucion/cdp/${command.id}/anular`, {
    method: 'POST',
    body: JSON.stringify({ id: command.id, motivo: command.motivo }),
  });
}
