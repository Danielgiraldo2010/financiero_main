// features/ejecucion/reservas/acciones/ui/EjecutarReservaDialog.tsx
// INVARIANTE 09b-I6: el usuario debe ingresar valorEjecutar (no es toggle).
import { useState } from 'react';
import { Dialog } from '@/shared/ui/modal/Dialog';
import { formatCOP } from '@/shared/lib/currency';
import { useEjecutarReserva } from '../hook';
import type { ReservaPresupuestalResponse } from '../../model/types';

interface Props { reserva: ReservaPresupuestalResponse; onClose: () => void; }

export function EjecutarReservaDialog({ reserva, onClose }: Props) {
  const [valorEjecutar, setValorEjecutar] = useState('');
  const ejecutar = useEjecutarReserva();

  const valorNum = parseFloat(valorEjecutar.replace(/,/g, ''));
  const valido   = !isNaN(valorNum) && valorNum > 0 && valorNum <= reserva.saldo;

  const handleEjecutar = async () => {
    if (!valido) return;
    await ejecutar.mutateAsync({ id: reserva.id, valorEjecutar: valorNum });
    onClose();
  };

  return (
    <Dialog open onClose={onClose} title="Ejecutar Reserva">
      <div className="space-y-4">
        <div className="rounded-lg bg-muted/40 p-3 text-sm space-y-1">
          <p><span className="text-muted-foreground">Reserva:</span> <strong className="font-mono">{reserva.numero}</strong></p>
          <p><span className="text-muted-foreground">Saldo disponible:</span> <strong className="text-green-700">{formatCOP(reserva.saldo)}</strong></p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Valor a Ejecutar *
            <span className="ml-1 text-xs text-muted-foreground">(máx. {formatCOP(reserva.saldo)})</span>
          </label>
          <input
            type="number"
            min={0}
            max={reserva.saldo}
            step={0.01}
            value={valorEjecutar}
            onChange={(e) => setValorEjecutar(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring"
            placeholder="0.00"
          />
          {!valido && valorEjecutar !== '' && (
            <p className="text-xs text-destructive mt-1">
              El valor debe ser mayor a 0 y no superar el saldo disponible.
            </p>
          )}
        </div>

        {ejecutar.isError && (
          <p className="text-sm text-destructive">Error al ejecutar la reserva.</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="button" onClick={handleEjecutar}
            disabled={!valido || ejecutar.isPending}
            className="btn-primary disabled:opacity-40">
            {ejecutar.isPending ? 'Ejecutando…' : 'Ejecutar Reserva'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
