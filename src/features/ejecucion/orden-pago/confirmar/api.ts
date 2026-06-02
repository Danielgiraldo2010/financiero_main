// features/ejecucion/orden-pago/confirmar/api.ts
// ACCIÓN IRREVERSIBLE — confirmar el pago de una OP (09b-I2)
import { fetcher } from '@/shared/api/fetcher';
import type { ConfirmarPagoOpCommand } from '../model/types';

export async function confirmarPagoOp(command: ConfirmarPagoOpCommand): Promise<void> {
  await fetcher<void>(`/api/v1/ejecucion/op/${command.id}/confirmar`, {
    method: 'POST',
    body: JSON.stringify(command),
  });
}
