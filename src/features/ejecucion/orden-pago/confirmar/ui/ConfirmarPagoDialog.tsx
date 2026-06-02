// features/ejecucion/orden-pago/confirmar/ui/ConfirmarPagoDialog.tsx
//
// INVARIANTE 09b-I2: acción IRREVERSIBLE.
//   - Texto explícito "Esta acción no se puede deshacer".
//   - Requiere fechaPago (date picker) + comprobantePago (texto).
import { useState } from 'react';
import { Dialog } from '@/shared/ui/modal/Dialog';
import { formatCOP } from '@/shared/lib/currency';
import { useConfirmarPagoOp } from '../hook';
import type { OrdenPagoResponse } from '../../model/types';

interface Props {
  op: OrdenPagoResponse;
  onClose: () => void;
}

export function ConfirmarPagoDialog({ op, onClose }: Props) {
  const [fechaPago, setFechaPago]           = useState('');
  const [comprobante, setComprobante]       = useState('');
  const [urlSoporte, setUrlSoporte]         = useState('');
  const confirmar = useConfirmarPagoOp();

  const puedeConfirmar = fechaPago.trim() !== '' && comprobante.trim() !== '';

  const handleConfirmar = async () => {
    if (!puedeConfirmar) return;
    await confirmar.mutateAsync({
      id:               op.id,
      fechaPago:        new Date(fechaPago).toISOString(),
      comprobantePago:  comprobante.trim(),
      urlSoportePago:   urlSoporte.trim() || null,
    });
    onClose();
  };

  return (
    <Dialog open onClose={onClose} title="Confirmar Pago de OP">
      <div className="space-y-4">
        {/* Encabezado de la OP */}
        <div className="rounded-lg bg-muted/40 p-3 text-sm space-y-1">
          <p><span className="text-muted-foreground">N.º OP:</span> <strong className="font-mono">{op.numero}</strong></p>
          <p><span className="text-muted-foreground">Beneficiario:</span> {op.beneficiario ?? '—'}</p>
          <p><span className="text-muted-foreground">Valor:</span> <strong>{formatCOP(op.valor)}</strong></p>
        </div>

        {/* Advertencia de irreversibilidad — INVARIANTE 09b-I2 */}
        <div className="rounded-md bg-destructive/10 border border-destructive p-3 text-sm text-destructive">
          <p className="font-semibold">⚠ Esta acción no se puede deshacer.</p>
          <p>Una vez confirmado el pago, el estado de la OP cambiará a PAGADO de forma permanente.</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha de Pago *</label>
          <input
            type="date"
            value={fechaPago}
            onChange={(e) => setFechaPago(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">N.º Comprobante de Pago *</label>
          <input
            type="text"
            value={comprobante}
            onChange={(e) => setComprobante(e.target.value)}
            placeholder="Número o referencia del comprobante"
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL Soporte de Pago</label>
          <input
            type="text"
            value={urlSoporte}
            onChange={(e) => setUrlSoporte(e.target.value)}
            placeholder="https://…"
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring"
          />
        </div>

        {confirmar.isError && (
          <p className="text-sm text-destructive">Error al confirmar el pago. Intente nuevamente.</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button
            type="button"
            onClick={handleConfirmar}
            disabled={!puedeConfirmar || confirmar.isPending}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium disabled:opacity-40"
          >
            {confirmar.isPending ? 'Confirmando…' : 'Confirmar Pago'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
