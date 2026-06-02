// features/ejecucion/radicacion/acciones/ui/AprobarRadicacionDialog.tsx
import { Dialog } from '@/shared/ui/modal/Dialog';
import { formatCOP } from '@/shared/lib/currency';
import { useAprobarRadicacion } from '../hook';
import type { RadicacionCuentaResponse } from '../../model/types';

interface Props { radicacion: RadicacionCuentaResponse; onClose: () => void; }

export function AprobarRadicacionDialog({ radicacion, onClose }: Props) {
  const aprobar = useAprobarRadicacion();

  const handleAprobar = async () => {
    await aprobar.mutateAsync(radicacion.id);
    onClose();
  };

  return (
    <Dialog open onClose={onClose} title="Aprobar Radicación">
      <div className="space-y-4">
        <div className="rounded-lg bg-muted/40 p-3 text-sm space-y-1">
          <p><span className="text-muted-foreground">Radicado:</span> <strong className="font-mono">{radicacion.numeroRadicado}</strong></p>
          <p><span className="text-muted-foreground">Proveedor:</span> {radicacion.proveedorNombre}</p>
          <p><span className="text-muted-foreground">Valor Neto:</span> <strong>{formatCOP(radicacion.valorNeto)}</strong></p>
        </div>
        <p className="text-sm">¿Confirma la aprobación de esta radicación?</p>
        {aprobar.isError && <p className="text-sm text-destructive">Error al aprobar la radicación.</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="button" onClick={handleAprobar} disabled={aprobar.isPending} className="btn-primary">
            {aprobar.isPending ? 'Aprobando…' : 'Aprobar Radicación'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
