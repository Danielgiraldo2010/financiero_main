import { useState } from 'react';
import { useNavigate }  from '@tanstack/react-router';
import { PageHeader }   from '@/shared/ui/layout/PageHeader';
import { formatCOP }    from '@/shared/lib/currency';
import { useViaticos }  from '../hook';
import { RegistrarViaticoDialog }   from '../../registrar/ui/RegistrarViaticoDialog';
import { AprobarViaticoDialog }     from '../../acciones/ui/AprobarViaticoDialog';
import { AnularViaticoDialog }      from '../../acciones/ui/AnularViaticoDialog';
import { GenerarCdpViaticoDialog }  from '../../acciones/ui/GenerarCdpViaticoDialog';
import { LiquidarViaticoDialog }    from '../../acciones/ui/LiquidarViaticoDialog';
import { ActualizarViaticoDialog }  from '../../actualizar/ui/ActualizarViaticoDialog';
import { LABEL_ESTADO_VIATICO }     from '../../../model/constants';
import type { ViaticoSolicitud }    from '../../../model/types';

type Dialog = { type: 'aprobar' | 'anular' | 'cdp' | 'liquidar' | 'editar'; id: number } | null;

export function ViaticosPage() {
  const navigate = useNavigate();
  const [openRegistrar, setOpenRegistrar] = useState(false);
  const [dialog, setDialog]               = useState<Dialog>(null);
  const [vigencia, setVigencia]           = useState(new Date().getFullYear());
  const { data, isLoading, isError }      = useViaticos({ vigencia });

  const closeDialog = () => setDialog(null);

  function actions(v: ViaticoSolicitud) {
    return (
      <div className="flex gap-1 flex-wrap">
        <button className="btn-ghost text-xs"
          onClick={() => navigate({
            to: '/sar-viaticos/viaticos/$id',
            params: { id: String(v.id) },
          })}>
          Ver
        </button>
        {(v.estado === 'BORRADOR') && (
          <button className="btn-ghost text-xs"
            onClick={() => setDialog({ type: 'editar', id: v.id })}>
            Editar
          </button>
        )}
        {v.estado === 'BORRADOR' && (
          <button className="btn-ghost text-xs"
            onClick={() => setDialog({ type: 'aprobar', id: v.id })}>
            Aprobar
          </button>
        )}
        {v.estado === 'APROBADO' && (
          <button className="btn-ghost text-xs"
            onClick={() => setDialog({ type: 'cdp', id: v.id })}>
            CDP
          </button>
        )}
        {v.estado === 'CON_CDP' && (
          <button className="btn-ghost text-xs text-green-700"
            onClick={() => setDialog({ type: 'liquidar', id: v.id })}>
            Liquidar
          </button>
        )}
        {(v.estado === 'BORRADOR' || v.estado === 'APROBADO') && (
          <button className="btn-ghost text-xs text-destructive"
            onClick={() => setDialog({ type: 'anular', id: v.id })}>
            Anular
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Viaticos"
        actions={
          <button className="btn-primary" onClick={() => setOpenRegistrar(true)}>
            Nueva solicitud
          </button>
        }
      />

      <div className="flex gap-3 items-end border-b pb-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Vigencia</label>
          <input type="number" className="input w-28" value={vigencia} min={2020} max={2099}
            onChange={e => setVigencia(Number(e.target.value))} />
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando...</p>}
      {isError   && <p className="text-sm text-red-600">Error al cargar viaticos.</p>}

      {data && data.items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No hay solicitudes de viatico para {vigencia}.
        </p>
      )}

      {data && data.items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Destino</th>
                <th>Salida</th>
                <th>Dias</th>
                <th>Valor calc.</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((v) => (
                <tr key={v.id}>
                  <td>{v.empleadoNombreCompleto}</td>
                  <td>{v.municipioDestinoNombre}</td>
                  <td>{v.fechaSalida}</td>
                  <td>{v.diasViaje}</td>
                  <td className="font-mono">{formatCOP(v.valorCalculado)}</td>
                  <td>
                    <span className={
                      v.estado === 'LIQUIDADO' ? 'badge-success' :
                      v.estado === 'APROBADO'  ? 'badge-warning'  :
                      v.estado === 'ANULADO'   ? 'badge-destructive' :
                      'badge-neutral'
                    }>
                      {LABEL_ESTADO_VIATICO[v.estado]}
                    </span>
                  </td>
                  <td>{actions(v)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RegistrarViaticoDialog
        open={openRegistrar} vigencia={vigencia}
        onClose={() => setOpenRegistrar(false)} />

      {dialog?.type === 'editar' && (
        <ActualizarViaticoDialog id={dialog.id} open onClose={closeDialog} />
      )}
      {dialog?.type === 'aprobar' && (
        <AprobarViaticoDialog viaticoId={dialog.id} open onClose={closeDialog} />
      )}
      {dialog?.type === 'anular' && (
        <AnularViaticoDialog viaticoId={dialog.id} open onClose={closeDialog} />
      )}
      {dialog?.type === 'cdp' && (
        <GenerarCdpViaticoDialog viaticoId={dialog.id} open onClose={closeDialog} />
      )}
      {dialog?.type === 'liquidar' && (
        <LiquidarViaticoDialog viaticoId={dialog.id} open onClose={closeDialog} />
      )}
    </div>
  );
}
