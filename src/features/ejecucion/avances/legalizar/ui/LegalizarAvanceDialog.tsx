// features/ejecucion/avances/legalizar/ui/LegalizarAvanceDialog.tsx
//
// INVARIANTE 09b-I4:
//   Schema real del backend (LegalizarAvanceCommand):
//   { id, valorLegalizado, urlDocumentoLegalizacion?, observaciones? }
//   El plan original mencionaba DocumentosPanel previo, pero el OpenAPI
//   maneja el documento como campo urlDocumentoLegalizacion (URL directa).
import { useState } from 'react';
import { Dialog } from '@/shared/ui/modal/Dialog';
import { formatCOP } from '@/shared/lib/currency';
import { useLegalizarAvance } from '../hook';
import type { AvanceLegalizacionResponse } from '../../model/types';

interface Props { avance: AvanceLegalizacionResponse; onClose: () => void; }

export function LegalizarAvanceDialog({ avance, onClose }: Props) {
  const [valorLegalizado, setValorLegalizado] = useState('');
  const [urlDoc, setUrlDoc]                  = useState('');
  const [observaciones, setObservaciones]    = useState('');
  const legalizar = useLegalizarAvance();

  const valorNum = parseFloat(valorLegalizado);
  const valido   = !isNaN(valorNum) && valorNum > 0;

  const handleLegalizar = async () => {
    if (!valido) return;
    await legalizar.mutateAsync({
      id:                       avance.id,
      valorLegalizado:          valorNum,
      urlDocumentoLegalizacion: urlDoc.trim()       || null,
      observaciones:            observaciones.trim() || null,
    });
    onClose();
  };

  return (
    <Dialog open onClose={onClose} title="Legalizar Avance">
      <div className="space-y-4">
        {/* Resumen del avance */}
        <div className="rounded-lg bg-muted/40 p-3 text-sm space-y-1">
          <p><span className="text-muted-foreground">Avance:</span> <strong className="font-mono">{avance.numero}</strong></p>
          <p><span className="text-muted-foreground">Beneficiario:</span> {avance.beneficiario}</p>
          <p><span className="text-muted-foreground">Valor Avance:</span> <strong>{formatCOP(avance.valorAvance)}</strong></p>
          {avance.diasParaVencimiento !== null && avance.diasParaVencimiento <= 5 && (
            <p className="text-destructive font-semibold text-xs">
              ⚠ Vence en {avance.diasParaVencimiento} día(s)
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Valor Legalizado *</label>
          <input
            type="number" min={0} step={0.01} value={valorLegalizado}
            onChange={(e) => setValorLegalizado(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring"
            placeholder="0.00"
          />
          {!valido && valorLegalizado !== '' && (
            <p className="text-xs text-destructive mt-1">Ingrese un valor válido mayor a cero.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL Documento de Legalización</label>
          <input
            type="text" value={urlDoc} onChange={(e) => setUrlDoc(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring"
            placeholder="https://…"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Observaciones</label>
          <textarea
            value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={2}
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring"
          />
        </div>

        {legalizar.isError && (
          <p className="text-sm text-destructive">Error al legalizar el avance. Intente nuevamente.</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="button" onClick={handleLegalizar}
            disabled={!valido || legalizar.isPending} className="btn-primary disabled:opacity-40">
            {legalizar.isPending ? 'Legalizando…' : 'Legalizar Avance'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
