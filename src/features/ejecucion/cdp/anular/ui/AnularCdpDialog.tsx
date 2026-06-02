// features/ejecucion/cdp/anular/ui/AnularCdpDialog.tsx
//
// INVARIANTE 09a-I3:
//   - Motivo mínimo 20 caracteres.
//   - El botón de confirmación dice explícitamente "Anular CDP"
//     (no usar el ConfirmDialog genérico del proyecto, que no exige motivo).
import { useState } from 'react';
import { Dialog } from '@/shared/ui/modal/Dialog';
import type { CdpResponse } from '../../model/types';
import { useAnularCdp } from '../hook';

interface Props {
  cdp: CdpResponse;
  onClose: () => void;
}

const MOTIVO_MIN = 20;

export function AnularCdpDialog({ cdp, onClose }: Props) {
  const [motivo, setMotivo] = useState('');
  const anular = useAnularCdp();

  const motivoValido = motivo.trim().length >= MOTIVO_MIN;

  const handleAnular = async () => {
    if (!motivoValido) return;
    await anular.mutateAsync({ id: cdp.id, motivo: motivo.trim() });
    onClose();
  };

  return (
    <Dialog open onClose={onClose} title="Anular CDP">
      <div className="space-y-4">
        <p className="text-sm">
          Está a punto de anular el CDP{' '}
          <strong className="font-mono">{cdp.numero}</strong>.
          Esta acción no puede revertirse.
        </p>

        <div>
          <label className="block text-sm font-medium mb-1">
            Motivo de anulación *
            <span className="ml-1 text-muted-foreground text-xs">
              (mínimo {MOTIVO_MIN} caracteres)
            </span>
          </label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows={3}
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring"
            placeholder="Describa el motivo de la anulación…"
          />
          <p className={`text-xs mt-1 ${motivo.trim().length < MOTIVO_MIN ? 'text-destructive' : 'text-muted-foreground'}`}>
            {motivo.trim().length} / {MOTIVO_MIN} caracteres mínimos
          </p>
        </div>

        {anular.isError && (
          <p className="text-sm text-destructive">
            Error al anular el CDP. Intente nuevamente.
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          {/* INVARIANTE 09a-I3: texto exacto "Anular CDP" */}
          <button
            type="button"
            onClick={handleAnular}
            disabled={!motivoValido || anular.isPending}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium disabled:opacity-40"
          >
            {anular.isPending ? 'Anulando…' : 'Anular CDP'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
