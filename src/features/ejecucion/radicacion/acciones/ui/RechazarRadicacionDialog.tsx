// features/ejecucion/radicacion/acciones/ui/RechazarRadicacionDialog.tsx
// INVARIANTE 09b-I3: motivo obligatorio mínimo 10 caracteres.
import { useState } from 'react';
import { Dialog } from '@/shared/ui/modal/Dialog';
import { useRechazarRadicacion } from '../hook';
import type { RadicacionCuentaResponse } from '../../model/types';

interface Props { radicacion: RadicacionCuentaResponse; onClose: () => void; }

const MOTIVO_MIN = 10;

export function RechazarRadicacionDialog({ radicacion, onClose }: Props) {
  const [motivo, setMotivo] = useState('');
  const rechazar = useRechazarRadicacion();
  const motivoValido = motivo.trim().length >= MOTIVO_MIN;

  const handleRechazar = async () => {
    if (!motivoValido) return;
    await rechazar.mutateAsync({ id: radicacion.id, motivo: motivo.trim() });
    onClose();
  };

  return (
    <Dialog open onClose={onClose} title="Rechazar Radicación">
      <div className="space-y-4">
        <p className="text-sm">
          Rechazando radicado <strong className="font-mono">{radicacion.numeroRadicado}</strong> de {radicacion.proveedorNombre}.
        </p>
        <div>
          <label className="block text-sm font-medium mb-1">
            Motivo del Rechazo * <span className="text-xs text-muted-foreground">(mín. {MOTIVO_MIN} caracteres)</span>
          </label>
          <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={3}
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring"
            placeholder="Indique el motivo del rechazo…" />
          <p className={`text-xs mt-1 ${motivo.trim().length < MOTIVO_MIN ? 'text-destructive' : 'text-muted-foreground'}`}>
            {motivo.trim().length} / {MOTIVO_MIN} mín.
          </p>
        </div>
        {rechazar.isError && <p className="text-sm text-destructive">Error al rechazar la radicación.</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="button" onClick={handleRechazar}
            disabled={!motivoValido || rechazar.isPending}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium disabled:opacity-40">
            {rechazar.isPending ? 'Rechazando…' : 'Rechazar Radicación'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
