// features/ejecucion/reservas/acciones/ui/AnularReservaDialog.tsx
import { useState } from 'react';
import { Dialog } from '@/shared/ui/modal/Dialog';
import { useAnularReserva } from '../hook';
import type { ReservaPresupuestalResponse } from '../../model/types';

interface Props { reserva: ReservaPresupuestalResponse; onClose: () => void; }

const MOTIVO_MIN = 10;

export function AnularReservaDialog({ reserva, onClose }: Props) {
  const [motivo, setMotivo] = useState('');
  const anular = useAnularReserva();
  const motivoValido = motivo.trim().length >= MOTIVO_MIN;

  const handleAnular = async () => {
    if (!motivoValido) return;
    await anular.mutateAsync({ id: reserva.id, motivo: motivo.trim() });
    onClose();
  };

  return (
    <Dialog open onClose={onClose} title="Anular Reserva">
      <div className="space-y-4">
        <p className="text-sm">
          Anulando reserva <strong className="font-mono">{reserva.numero}</strong>.
          Esta acción no puede revertirse.
        </p>
        <div>
          <label className="block text-sm font-medium mb-1">
            Motivo * <span className="text-xs text-muted-foreground">(mín. {MOTIVO_MIN} caracteres)</span>
          </label>
          <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={3}
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring" />
          <p className={`text-xs mt-1 ${motivo.trim().length < MOTIVO_MIN ? 'text-destructive' : 'text-muted-foreground'}`}>
            {motivo.trim().length} / {MOTIVO_MIN} mín.
          </p>
        </div>
        {anular.isError && <p className="text-sm text-destructive">Error al anular la reserva.</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="button" onClick={handleAnular} disabled={!motivoValido || anular.isPending}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium disabled:opacity-40">
            {anular.isPending ? 'Anulando…' : 'Anular Reserva'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
